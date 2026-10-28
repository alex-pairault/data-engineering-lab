"""End-to-end QA in an isolated browser profile. Never uses the learner's browser data."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'.local'/'qa'
OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get('FIELDNOTES_TEST_URL','http://127.0.0.1:8766')
KEY='fieldnotes.progress.v1'
PAGES={
 'request-trace':('0001-request-response.html',['The browser rendering logic','The requested HTTP operation succeeded']),
 'authentication':('0002-authentication.html',['Check a supplied password safely','A password and security key']),
 'sessions':('0003-sessions.html',['Inside the server’s session record','Invalidate the server’s session record']),
 'cache-isolation':('0004-cache-isolation.html',['The cached path bypasses it','A key per authenticated user']),
 'agent-verification':('0005-agent-verification.html',['Two users read sequentially, cached','The acceptable age of data'])
}

def open_page(page,path=''):
    page.goto(f'{BASE}/{path}')
    page.wait_for_load_state('networkidle')

def overflow(page):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Horizontal overflow'

def run():
 with sync_playwright() as p:
    executable=os.environ.get('FIELDNOTES_CHROME')
    browser=p.chromium.launch(headless=True,**({'executable_path':executable} if executable else {}))
    context=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda error:errors.append(error.stack))
    open_page(page)
    expect(page.get_by_role('heading',name='Your next 30 minutes.')).to_be_visible()
    page.screenshot(path=str(OUT/'app-desktop.png'),full_page=False)
    overflow(page)
    open_page(page,'index.html#course')
    expect(page.locator('.course-row')).to_have_count(37)
    page.locator('#ready-filter').select_option('ready');expect(page.locator('.course-row')).to_have_count(37)
    page.locator('#ready-filter').select_option('all');page.locator('#domain-filter').select_option('web');expect(page.locator('.course-row')).to_have_count(9)
    page.locator('#domain-filter').select_option('all');page.locator('#course-search').fill('docker');expect(page.locator('.course-row')).to_have_count(1)
    expect(page.get_by_role('link',name='Open lesson',exact=True)).to_have_count(1)
    page.locator('#course-search').fill('nginx');expect(page.locator('.course-row')).to_have_count(1)
    expect(page.get_by_role('link',name='Open lesson',exact=True)).to_have_count(1)
    page.locator('#course-search').fill('');page.locator('#ready-filter').select_option('planned');expect(page.get_by_role('heading',name='No matching sessions')).to_be_visible()
    page.locator('#ready-filter').select_option('all')
    page.locator('#course-search').fill('no-such-topic');expect(page.get_by_role('heading',name='No matching sessions')).to_be_visible()

    for lesson_id,(filename,answers) in PAGES.items():
        open_page(page,f'lessons/{filename}')
        expect(page.locator('#save-practice')).to_be_disabled()
        page.locator('#recall-answer').fill('QA recall: I will trace the source, the state, and the return path.')
        page.locator('#save-recall').click()
        if lesson_id=='request-trace':
            page.get_by_role('button',name='Send request',exact=True).click()
            expect(page.locator('#response-summary')).to_contain_text('HTTP 200')
            expect(page.locator('#response-body')).to_contain_text('25')
            expect(page.locator('#display-price')).to_have_text('20')
            page.get_by_role('button',name='Apply response to page').click()
            expect(page.locator('#display-price')).to_have_text('25')
            page.locator('#interactive-lab').screenshot(path=str(OUT/'request-lab.png'))
        elif lesson_id=='authentication':
            page.locator('#credential-case').select_option('invalid');page.get_by_role('button',name='Attempt sign-in').click()
            expect(page.locator('.lab-status')).to_contain_text('Identity rejected')
            page.locator('#credential-case').select_option('valid');page.get_by_role('button',name='Attempt sign-in').click()
        elif lesson_id=='sessions':
            page.get_by_role('button',name='Sign in as Mina').click()
            page.get_by_role('button',name='Send protected request').click()
            page.locator('#browser-claim').select_option('Owen');page.get_by_role('button',name='Send protected request').click()
            expect(page.locator('.lab-status')).to_contain_text('recognized as Mina')
            page.get_by_role('button',name='Advance past server expiry').click();page.get_by_role('button',name='Send protected request').click()
            expect(page.locator('.lab-status')).to_contain_text('401')
            page.locator('#interactive-lab').screenshot(path=str(OUT/'session-lab.png'))
        elif lesson_id=='cache-isolation':
            page.get_by_role('button',name='Request as Mina').click();page.get_by_role('button',name='Request as Owen').click()
            expect(page.locator('.lab-status')).to_contain_text('Wrong user')
            page.locator('#cache-mode').select_option('scoped')
            for user in ['Mina','Owen','Mina','Owen']:page.get_by_role('button',name=f'Request as {user}').click()
            expect(page.locator('.lab-status')).to_contain_text('Ownership matches')
        else:
            page.get_by_role('button',name='Run selected checks').click()
            expect(page.locator('.lab-status')).to_contain_text('Both builds pass')
            expect(page.locator('#lab-evidence')).not_to_contain_text('✓')
            for value in ['cross','reverse','expiry']:page.locator(f'input[name="test-case"][value="{value}"]').check()
            page.get_by_role('button',name='Run selected checks').click()
            expect(page.locator('#test-results')).to_contain_text('FAIL')
            page.locator('#interactive-lab').screenshot(path=str(OUT/'verification-lab.png'))
        expect(page.locator('#lab-evidence')).to_contain_text('✓')
        if lesson_id=='request-trace':
            form=page.locator('[data-question="q1"]');form.get_by_label('The database update statement',exact=True).check();form.get_by_role('button',name='Check answer').click();expect(form.locator('.quiz-feedback')).to_contain_text('Not yet')
            expect(page.locator('#save-practice')).to_be_disabled()
            form.get_by_role('button',name='Show hint').click();expect(form.locator('.hint')).to_be_visible()
        for index,answer in enumerate(answers,1):
            form=page.locator(f'[data-question="q{index}"]');form.get_by_label(answer,exact=True).check();form.get_by_role('button',name='Check answer').click();expect(form.locator('.quiz-feedback')).to_contain_text('Correct.')
        expect(page.locator('#save-practice')).to_be_disabled()
        explanation='QA explanation: I predicted the boundary, ran the example, compared evidence, and checked the changed behaviour.'
        if lesson_id=='request-trace':explanation+=' <img src=x onerror="window.__injected=true">'
        page.locator('#reflection-answer').fill(explanation)
        page.locator('input[name="confidence"][value="3"]').check()
        expect(page.locator('#save-practice')).to_be_enabled()
        page.locator('#save-practice').click();expect(page.locator('#practice-status')).to_contain_text('Next spaced review')
        page.reload();page.wait_for_load_state('networkidle')
        expect(page.locator('#reflection-answer')).to_have_value(explanation)
        expect(page.locator('#lab-evidence')).to_contain_text('earlier visit')
        overflow(page)

    open_page(page,'index.html#evidence')
    expect(page.locator('.evidence-item')).to_have_count(5)
    assert not page.evaluate('Boolean(window.__injected)')
    expect(page.get_by_role('button',name='Try spaced review')).to_have_count(0)
    page.get_by_role('button',name='Bring to tutor').first.click();assert 'My explanation:' in page.locator('#tutor-context').input_value();page.get_by_role('button',name='Close dialog').click()
    open_page(page,'index.html#backups')
    with page.expect_download() as download_info:page.get_by_role('button',name='Export progress').click()
    backup=OUT/'qa-progress.json';download_info.value.save_as(backup)
    exported=json.loads(backup.read_text());assert len(exported['lessons'])==5
    page.locator('#import-file').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{broken'})
    expect(page.locator('#import-preview')).to_contain_text('not valid JSON');expect(page.locator('#import-progress')).to_be_disabled()

    second=browser.new_context(viewport={'width':390,'height':844})
    mobile=second.new_page();mobile.on('pageerror',lambda error:errors.append(error.stack))
    open_page(mobile);overflow(mobile);mobile.screenshot(path=str(OUT/'app-mobile.png'),full_page=True)
    mobile.get_by_role('button',name='Menu',exact=True).click();expect(mobile.get_by_role('button',name='Menu',exact=True)).to_have_attribute('aria-expanded','true')
    mobile.keyboard.press('Escape');expect(mobile.get_by_role('button',name='Menu',exact=True)).to_have_attribute('aria-expanded','false')
    open_page(mobile,'index.html#backups');mobile.locator('#import-file').set_input_files(backup);expect(mobile.locator('#import-preview')).to_contain_text('5 lesson entries')
    mobile.get_by_role('button',name='Merge backup').click();expect(mobile.locator('#import-preview')).to_contain_text('Backup merged')
    open_page(mobile,'index.html#evidence');expect(mobile.locator('.evidence-item')).to_have_count(5);overflow(mobile)
    for filename,_ in PAGES.values():
        open_page(mobile,f'lessons/{filename}');overflow(mobile)
    mobile.locator('#interactive-lab').screenshot(path=str(OUT/'lesson-mobile.png'))
    mobile.emulate_media(media='print');overflow(mobile);mobile.screenshot(path=str(OUT/'lesson-print.png'),full_page=True);mobile.emulate_media(media='screen')

    due_state=exported
    due_state['lessons']['request-trace']['practicedAt']='2026-01-01T10:00:00.000Z'
    due_state['lessons']['request-trace']['reviewDueAt']='2026-01-03T10:00:00.000Z'
    mobile.evaluate('([key,value])=>localStorage.setItem(key,value)',[KEY,json.dumps(due_state)])
    open_page(mobile,'index.html#evidence');mobile.get_by_role('button',name='Try spaced review').click()
    mobile.get_by_role('button',name='The browser’s state and rendering',exact=True).click()
    expect(mobile.locator('#review-result')).to_contain_text('Correct.')
    mobile.get_by_role('button',name='Close dialog').click();expect(mobile.get_by_role('button',name='Try spaced review')).to_have_count(0)
    assert len(mobile.evaluate('(key)=>JSON.parse(localStorage.getItem(key)).lessons["request-trace"].reviews',KEY))==1
    # Exercise a blocked localStorage write without touching any real learner profile.
    blocked=browser.new_context(accept_downloads=True)
    blocked.add_init_script("""const originalSetItem=Storage.prototype.setItem;
      Storage.prototype.setItem=function(key,value){if(key==='fieldnotes.progress.v1')throw new DOMException('QA quota','QuotaExceededError');return originalSetItem.call(this,key,value);};""")
    recovery=blocked.new_page();recovery.on('pageerror',lambda error:errors.append(error.stack))
    open_page(recovery,'lessons/0001-request-response.html')
    recovery.locator('#recall-answer').fill('QA draft retained after a failed browser write.')
    recovery.locator('#save-recall').click()
    expect(recovery.locator('#storage-recovery')).to_contain_text('kept in memory')
    with recovery.expect_download() as recovery_info:
        recovery.get_by_role('button',name='Export current draft').click()
    recovery_backup=OUT/'qa-recovery.json';recovery_info.value.save_as(recovery_backup)
    assert json.loads(recovery_backup.read_text())['lessons']['request-trace']['recall']=='QA draft retained after a failed browser write.'
    blocked.close()
    assert not errors,errors
    print('Browser QA passed: five labs and completion flows, persistence, filtering, malformed import, backup transfer, escaped notes, review scheduling, mobile, print, storage-failure draft export, no page errors.')
    browser.close()

if __name__=='__main__':run()
