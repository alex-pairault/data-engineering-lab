export const nextLessonData = {
  "api-contracts": {
    recall:
      "A request returns 200 but an older client crashes after a release. What might have changed, and what would you compare?",
    reflection:
      "Describe the request rule, the rejected input, the cursor you followed, and the response change that broke the old client. Propose one compatibility check before release.",
    evidence:
      "Try valid and invalid limits, follow the returned next-page cursor, and expose a breaking response shape on the same endpoint.",
    checks: [
      {
        id: "q1",
        question:
          "The endpoint documents limit 1 or 2. A caller sends 0. What should this implementation do?",
        options: [
          "Return an unbounded product list",
          "Accept because authentication already passed",
          "Reject with the documented error",
          "Trust only the browser validation",
        ],
        answer: 2,
        hint: "The service owns the request boundary; browser validation is not sufficient.",
        feedback:
          "Reject invalid input consistently with the documented API contract. This model uses a structured 400 response.",
      },
      {
        id: "q2",
        question:
          "The same endpoint replaces an integer field with an object and returns 200. What follows?",
        options: [
          "The HTTP status guarantees compatibility",
          "Existing clients may reject it",
          "All existing clients remain compatible",
          "The database schema stayed identical",
        ],
        answer: 1,
        hint: "Compare what existing consumers read, not just whether the JSON parses.",
        feedback:
          "A successful HTTP status does not preserve field names, types, or meaning. Check real consumers and the declared response contract.",
      },
    ],
    review: {
      question:
        "A proposed release adds an optional response field. What evidence helps decide compatibility?",
      options: [
        "Check existing consumers and contract",
        "Remove all existing required fields",
        "Change every numeric field silently",
        "Assume all consumers ignore changes",
      ],
      answer: 0,
      feedback:
        "An additive field can be compatible if existing consumers tolerate it. Verify their assumptions and the interface contract.",
    },
  },
  "python-debug": {
    recall:
      "Your input file doubles in size. Predict what happens to memory when a script loads every record into a list, compared with processing one record at a time.",
    reflection:
      "Record your two input sizes and measurements. Explain one change you would make, its tradeoff, and why CPU time, elapsed time, traced allocations, and process RAM are different observations.",
    evidence:
      "Run the supplied Python script locally, paste its four-case JSON report, and compare the two input sizes. No Python runs in this browser.",
    checks: [
      {
        id: "q1",
        question: "What does tracemalloc peak memory describe?",
        options: [
          "CPU cycles across every process",
          "Traced Python allocations, not everything",
          "All physical RAM, including browsers",
          "Only bytes read from storage",
        ],
        answer: 1,
        hint: "Distinguish Python allocation tracing from the memory of the entire process or machine.",
        feedback:
          "Peak traced allocations identify Python-managed allocation pressure. Compare process RAM separately and explain profiler overhead and limits.",
      },
      {
        id: "q2",
        question:
          "Your streamed run returns the same output with lower peak allocation. Which claim is supported?",
        options: [
          "Peak allocations fell; output matched",
          "Every future workload becomes faster",
          "Disk latency was precisely measured",
          "Extra CPU cores became unnecessary",
        ],
        answer: 0,
        hint: "State only the result the measured workload supports.",
        feedback:
          "This supports a memory improvement for this workload and run. It does not establish universal speedups or identify every bottleneck.",
      },
    ],
    review: {
      question:
        "An operation takes 10 seconds elapsed but 0.1 seconds of current-process CPU time. What is a useful next step?",
      options: [
        "Conclude the processor needs replacement",
        "Conclude all memory is exhausted",
        "Multiply workers without measuring again",
        "Investigate waiting and scheduling first",
      ],
      answer: 3,
      feedback:
        "Low CPU time relative to elapsed time motivates investigating waits, I/O, locks, and scheduling. The difference alone is not a precise I/O measurement.",
    },
  },
  "sql-joins": {
    recall:
      "A LEFT JOIN should keep customers with no orders. Can a later WHERE condition on the order change that? Predict the result before opening the examples.",
    reflection:
      "Explain why Ben and Cy disappear or remain. Distinguish missing groups from NULL sums and show how your chosen query returns the required paid totals.",
    evidence:
      "Compare the WHERE, raw SUM, ON/COALESCE, and CASE query presets. Then execute the shared fixture with the downloadable Python/SQLite script.",
    checks: [
      {
        id: "q1",
        question:
          "Why do customers disappear after a right-side paid-status WHERE filter?",
        options: [
          "Filtering removed their joined rows",
          "COALESCE recreated their missing groups",
          "SUM automatically deleted every zero",
          "LEFT JOIN prohibited unmatched customers",
        ],
        answer: 0,
        hint: "Trace the join stage, then the filter stage, then grouping.",
        feedback:
          "The filter removes unmatched and non-qualifying joined rows. An aggregate cannot restore a customer group that no longer exists.",
      },
      {
        id: "q2",
        question:
          "A retained customer has SUM(amount) = NULL because no paid amount matched. What supplies the required zero?",
        options: [
          "WHERE restores every missing customer",
          "Sorting supplies zero for NULL",
          "Grouping guarantees non-null sum results",
          "COALESCE supplies zero for NULL",
        ],
        answer: 3,
        hint: "The group exists; the aggregate value needs an explicit fallback.",
        feedback:
          "COALESCE handles the NULL aggregate for a retained group. Qualifying-order filters must also be placed so the customer survives.",
      },
    ],
    review: {
      question:
        "A customer has only pending orders. Why can WHERE paid OR order_id IS NULL still lose that customer?",
      options: [
        "Their rows were permanently deleted",
        "The cache changed their ownership",
        "They matched rows before filtering",
        "They never matched any rows",
      ],
      answer: 2,
      feedback:
        "Their pending orders matched the join, so the rows have non-NULL order IDs. Neither WHERE alternative keeps those rows.",
    },
  },
  "cache-freshness": {
    recall:
      "An application caches a value for 60 seconds. The source changes after five seconds. What do you expect the next cache hit to return, and why?",
    reflection:
      "Record the read/change/time/read sequence. Explain the difference between a live entry, a stale value, an expired entry, and the later request that reloads it. State a product freshness requirement.",
    evidence:
      "Load a value, change the source while the entry is live, observe a stale hit, then advance beyond expiry and read again.",
    checks: [
      {
        id: "q1",
        question:
          "An entry expires, but no client request arrives. What happens in this cache-aside model?",
        options: [
          "The source always refreshes itself",
          "Every client receives new data",
          "All stale entries become current",
          "No replacement is fetched automatically",
        ],
        answer: 3,
        hint: "Expiration controls reuse. A later read is responsible for the reload here.",
        feedback:
          "Expiry does not proactively fetch data in this model. The next miss loads a replacement.",
      },
      {
        id: "q2",
        question: "Why can an entry with remaining TTL already be stale?",
        options: [
          "Source updates always invalidate entries",
          "Cache hits always query storage",
          "Reuse eligibility differs from freshness",
          "Fixed lifetimes always extend themselves",
        ],
        answer: 2,
        hint: "Compare the stored value with the current source, not just the expiry clock.",
        feedback:
          "A source update can make a still-live entry stale. Invalidation or another refresh policy may be needed.",
      },
    ],
    review: {
      question:
        "A cache loads from a delayed upstream feed. Does a short TTL alone prove the data is current?",
      options: [
        "Ignore all source update timings",
        "Check source freshness and loading",
        "Assume TTL proves source freshness",
        "Increase the lifetime without evidence",
      ],
      answer: 1,
      feedback:
        "TTL measures entry lifetime. A freshly loaded cache entry can still contain old upstream data.",
    },
  },
  "cache-invalidation": {
    recall:
      "An update deletes a cache entry before the database transaction commits. What might a second reader do between those two steps?",
    reflection:
      "Write the interleaving that produced stale data, then the corrected ordering. Include the rollback result and one failure that after-commit invalidation alone still does not solve.",
    evidence:
      "Step through delete-before-commit, delete-after-commit, and rollback scenarios. Inspect the final read in each.",
    checks: [
      {
        id: "q1",
        question:
          "Why did the bad sequence leave the old value cached after the update?",
        options: [
          "Commit automatically repaired every entry",
          "Rollback committed the new value",
          "Reader refilled before commit completed",
          "Reader always skipped the cache",
        ],
        answer: 2,
        hint: "Find the reader between deletion and commit.",
        feedback:
          "A cache miss loaded the still-old committed source before the writer committed. That refill then survived the update.",
      },
      {
        id: "q2",
        question:
          "When should the illustrated transaction schedule its cache deletion?",
        options: [
          "Whenever the browser changes styling",
          "After the successful database commit",
          "Before the database transaction begins",
          "After preparing an uncommitted update",
        ],
        answer: 1,
        hint: "An issued update can still roll back. Use the successful commit boundary.",
        feedback:
          "After-commit invalidation avoids the demonstrated early-deletion race and should not run on rollback. It is not a universal consistency guarantee.",
      },
    ],
    review: {
      question:
        "The transaction commits, then cache deletion fails. What is the useful conclusion?",
      options: [
        "The database stays committed; recover",
        "The database always rolls back",
        "The cache always repairs itself",
        "The user always receives freshness",
      ],
      answer: 0,
      feedback:
        "A cache action after commit is outside the completed database transaction. Plan detection/retry or another consistency mechanism; do not assume automatic rollback.",
    },
  },
};
