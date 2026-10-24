# Software and data engineering resources

## Knowledge

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
- [MDN: HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
  Use for browser and shared caches, freshness, validation, Cache-Control, and handling personalised responses.
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
- [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html)
  Use for focused refreshers on joins, transactions, and window functions; select the relevant sections rather than restarting from the beginning.
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

These official documentation links were checked on October 24, 2026. Match documentation to the project's chosen versions when implementation starts.

## Wisdom (communities)

No community has been selected. Seek focused feedback on a working example once the first exercise is ready; do not post or contact anyone automatically.

## Gaps

- Add focused references for API design, protocol-level OAuth/OpenID Connect/JWT distinctions, application caching, and observability when designing the corresponding exercises.
- Select version-specific setup references after choosing the project's runtime and database.
