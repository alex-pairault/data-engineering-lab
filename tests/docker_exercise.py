"""Optional real Docker QA. Run explicitly: python tests/docker_exercise.py

Builds only the two public exercise files, uses unique disposable names and
loopback ports, then removes only resources created by this invocation.
Requires a running Docker engine; not part of the standard no-Docker CI suite.
"""
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import time
from urllib.request import build_opener, ProxyHandler, Request
import uuid

ROOT=Path(__file__).resolve().parent.parent


def docker(*args):
    return subprocess.run(['docker',*args],capture_output=True,text=True,check=True).stdout.strip()


def run():
    prefix='fieldnotes-l14-qa-'+uuid.uuid4().hex[:10]
    image=prefix+':test'
    volume=prefix+'-data'
    created=[]
    volume_created=False
    image_created=False
    opener=build_opener(ProxyHandler({}))

    def create(suffix,persistent=False,published=True):
        name=prefix+'-'+suffix
        args=['run','-d','--name',name,'--memory=128m','--cpus=0.5']
        if published:args+=['-p','127.0.0.1::8000']
        if persistent:args+=['-v',volume+':/data']
        docker(*args,image)
        created.append(name)
        return name

    def request(name,method='GET'):
        endpoint=docker('port',name,'8000/tcp')
        url='http://'+endpoint+'/'
        deadline=time.monotonic()+10
        while True:
            try:
                with opener.open(Request(url,method=method),timeout=2) as response:
                    return json.loads(response.read())['count']
            except OSError:
                if time.monotonic()>=deadline:raise
                time.sleep(0.1)

    def remove(name):
        docker('rm','-f',name)
        created.remove(name)

    try:
        with tempfile.TemporaryDirectory() as directory:
            for filename in ['Dockerfile','docker_counter.py']:
                shutil.copy(ROOT/'assets/exercises'/filename,Path(directory)/filename)
            docker('build','-t',image,directory)
            image_created=True
        unpublished=create('unpublished',published=False)
        assert docker('port',unpublished)==''
        remove(unpublished)
        layer=create('layer')
        assert request(layer,'POST')==1
        docker('stop',layer);docker('start',layer)
        assert request(layer)==1
        remove(layer)
        replacement=create('replacement')
        assert request(replacement)==0
        remove(replacement)
        docker('volume','create',volume);volume_created=True
        first=create('volume-first',persistent=True)
        assert request(first,'POST')==1
        remove(first)
        second=create('volume-second',persistent=True)
        assert request(second)==1
        metadata=json.loads(docker('inspect',second))[0]
        assert metadata['HostConfig']['Memory']==128*1024*1024
        assert metadata['HostConfig']['NanoCpus']==500000000
        assert metadata['Mounts'][0]['Destination']=='/data'
        print('PASS: unpublished port; stop/start retention; replacement reset; named-volume retention; CPU/RAM budgets.')
    finally:
        for name in created:
            subprocess.run(['docker','rm','-f',name],capture_output=True)
        if volume_created:subprocess.run(['docker','volume','rm',volume],capture_output=True)
        if image_created:subprocess.run(['docker','image','rm',image],capture_output=True)


if __name__=='__main__':run()
