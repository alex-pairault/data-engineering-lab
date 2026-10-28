# Software and data engineering resources

## Knowledge

Select one focused section per lesson to keep reading small and directly connected to its exercise.

- [MDN: Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
  Use to trace a request and response and place browsers, servers, and intermediaries in the same picture.
- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
  Use for browser/server state, a cookie-based login flow, and cookie attributes. Distinguish a session from a cookie and from browser sessionStorage.
- [OWASP: Authentication cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
  Use to ground the dedicated authentication lesson in identity verification, password handling, MFA, and account recovery. Choose one relevant section per exercise.
- [OWASP: Authorization cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
  Use for server-side permission and resource-ownership checks, including the difference between signing in and being allowed to perform an operation.
- [MDN: Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
  Use to investigate browser cross-origin behaviour and distinguish it from API access control.
- [PHP manual: Session handling](https://www.php.net/manual/en/book.session.php)
  Use to connect the session model to PHP's session identifiers, session_start, and session data across requests.
- [OWASP: Session management cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
  Use for server-side session validity, identifier handling, and expiry/logout checks in the session lesson.
- [MDN: HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
  Use for browser and shared caches, freshness, validation, Cache-Control, and handling personalised responses.
- [Chrome DevTools: Network features reference](https://developer.chrome.com/docs/devtools/network/reference/)
  Use to inspect actual request/response evidence and compare behaviour with browser HTTP caching disabled.
- [Nginx: Beginner's guide](https://nginx.org/en/docs/beginners_guide.html)
  Use to understand static serving, proxying, and the relationship between a web server and an application runtime.
- [GitHub: Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
  Use when making verification repeatable with a small CI workflow.
- [Pro Git](https://git-scm.com/book/en/v2)
  Use selected chapters on diffs, branching, merging, and distributed collaboration when the corresponding portfolio task arises.
- [Sentry: Product walkthroughs](https://docs.sentry.io/product/)
  Use to understand how captured errors and related application evidence support diagnosis; select a focused walkthrough when the observability exercise is designed.
- [Python tutorial: Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)
  Use for interpreting tracebacks and understanding exception handling before implementing ingestion failure paths.
- [Python: Time access and conversions](https://docs.python.org/3/library/time.html)
  Use `perf_counter` for elapsed duration and `process_time` for CPU time of the current process. Compare both when investigating computing versus waiting. Added and checked October 27, 2026.
- [Python: tracemalloc](https://docs.python.org/3/library/tracemalloc.html)
  Use for current/peak traced Python allocations in the hardware lesson. Start tracing before the measured allocations and distinguish these figures from total process RAM. Added and checked October 27, 2026.
- [Microsoft: Server hardware performance considerations](https://learn.microsoft.com/en-us/windows-server/administration/performance-tuning/hardware/)
  Use the processor, cache, memory, and I/O sections for the hardware mental model. The configuration advice is Windows-specific; the lesson uses the resource relationships, not its machine-purchasing or operating-system tuning recommendations. Added and checked October 27, 2026.
- [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html)
  Use for focused refreshers on joins, transactions, and window functions; select the relevant sections rather than restarting from the beginning.
- [PostgreSQL: Table expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
  Use to trace outer joins, WHERE filtering, and grouping on small fixtures that include missing or filtered-out matches.
- [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
  Use to explain a concrete concurrent-update scenario; match the example to the chosen database version and isolation level.
- [RabbitMQ: Work queues tutorial](https://www.rabbitmq.com/tutorials/tutorial-two-python)
  Use as a reference for workers, acknowledgements, and redelivery. Studying the mechanism does not require adopting RabbitMQ for the project.
- [dbt: Data tests](https://docs.getdbt.com/docs/build/data-tests)
  Use when turning assumptions about keys, relationships, and acceptable values into explicit checks.
- [Apache Airflow: Architecture overview](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html)
  Use to connect workflow dependencies and task execution to the components responsible for running them.
- [Docker: Get started](https://docs.docker.com/get-started/)
  Use when adding reproducible local execution and learning the distinction between an image and a running container.

The initial official documentation links were checked on October 24, 2026; later additions record their own check dates above. Match documentation to the project's chosen versions when implementation starts.

## Wisdom (communities)

No community has been selected. Seek focused feedback on a working example once the first exercise is ready; do not post or contact anyone automatically.

## Gaps

- Add focused references for protocol-level OAuth/OpenID Connect/JWT distinctions and observability when designing the corresponding exercises.
- Select version-specific setup references after choosing the project's runtime and database.

## Sources used for lessons 6–10

Checked October 27, 2026. Select the named sections; do not treat the full reference as a 30-minute reading assignment.

- [OpenAPI 3.1.1 specification](https://spec.openapis.org/oas/v3.1.1.html): interface description, parameters, and response schemas; a specification is not automatic validation.
- [OWASP input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html): server-side syntactic and semantic validation.
- [Google AIP-180](https://google.aip.dev/180): compatibility assumptions when fields and types change.
- [IBM hardware overview](https://www.ibm.com/think/topics/hardware): CPU, memory, and storage roles.
- [Python file objects](https://docs.python.org/3/tutorial/inputoutput.html#methods-of-file-objects): iteration versus reading a file into memory. Use the timing and tracemalloc references above for the measured exercise.
- [Python resource usage](https://docs.python.org/3/library/resource.html): process resource accounting and platform differences. [Linux getrusage](https://www.man7.org/linux/man-pages/man2/getrusage.2.html) specifies Linux peak RSS units.
- [PostgreSQL aggregates](https://www.postgresql.org/docs/current/functions-aggregate.html): NULL aggregate behaviour. [COALESCE](https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL) supplies a fallback for a retained group; see table expressions above for join/filter ordering.
- [Redis EXPIRE](https://redis.io/docs/latest/commands/expire/): entry lifetime and expiration behaviour.
- [Microsoft cache-aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside): miss/reload behaviour, stale data, and ordering of source updates and invalidation.
- [Django after-commit actions](https://docs.djangoproject.com/en/5.2/topics/db/transactions/#performing-actions-after-commit): successful-commit callbacks, rollback behaviour, and callback failure limits. The lesson's transaction code is pseudocode, not a Django integration.


## Sources used for lessons 11–15

Checked October 28, 2026. Read the focused sections linked from each lesson.

- [Python process environment](https://docs.python.org/3/library/os.html#os.environ), [socket addresses](https://docs.python.org/3/library/socket.html), and [local HTTP servers](https://docs.python.org/3/library/http.server.html): process configuration, listening endpoints and the teaching server's limits.
- [Microsoft logical layers](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures) and [domain validation](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations): responsibilities and invariants across callers, adapted to a small Python function example rather than a framework requirement.
- [Git merge/conflict resolution](https://git-scm.com/docs/git-merge#_how_to_resolve_conflicts): inspect, resolve, stage and verify the intended result.
- [npm lockfiles](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/) and [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/): resolved graphs, manifest consistency, replacement of node_modules and frozen installation behaviour.
- [Docker images](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/), [publishing ports](https://docs.docker.com/engine/network/port-publishing/), and [volumes](https://docs.docker.com/engine/storage/volumes/): image/container distinction, loopback host mappings and persistent state lifecycle. [Docker resource limits](https://docs.docker.com/engine/containers/resource_constraints/) connects the exercise budgets to the hardware lesson.
- [Microsoft grain/granularity](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema), [PostgreSQL join multiplicity](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-JOIN), and [constraints](https://www.postgresql.org/docs/current/ddl-constraints.html): row meaning, matching pairs and distinct protections. [SQLite foreign keys](https://www.sqlite.org/foreignkeys.html) explains per-connection enforcement in the runnable exercise.
