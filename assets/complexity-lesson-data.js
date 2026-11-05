export const complexityLessonData = {
  "cx-growth": {
    recall:
      "If a list grows from 10 items to 100, does reading its first item require reading the other 99? What about adding every item?",
    reflection:
      "Define n (and any second input size), state the case and cost assumptions, count the growing work, and separately explain storage. Record your command, observed counts, changed case, and help used.",
    evidence:
      "Predict the count model, implement the local Python task, run its tests and operation probe, and add your own changed case before recording coding evidence.",
    checks: [
      {
        id: "q1",
        question: "What does n mean in this lesson?",
        options: [
          "The number of input items",
          "The seconds one program takes",
          "The number of installed packages",
          "The size of one integer",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback: "Name the input size before choosing a growth class.",
      },
      {
        id: "q2",
        question:
          "A full scan reads n items. If n doubles, what happens to that count?",
        options: [
          "The read count doubles too",
          "The read count stays fixed",
          "The read count becomes squared",
          "The read count becomes halved",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback: "n item reads become 2n item reads. This is linear growth.",
      },
    ],
    review: {
      question:
        "Reading the last item by a known list index uses which usual growth class?",
      options: [
        "Linear work relative to length",
        "Quadratic work relative to length",
        "Exponential work relative to length",
        "Constant work relative to length",
      ],
      answer: 3,
      feedback:
        "Direct list indexing does not scan earlier items under this CPython list model.",
    },
  },
  "cx-loops": {
    recall:
      "Two loops appear in a function. Must its work be quadratic? What determines how many times the inner body executes?",
    reflection:
      "Define n (and any second input size), state the case and cost assumptions, count the growing work, and separately explain storage. Record your command, observed counts, changed case, and help used.",
    evidence:
      "Predict the count model, implement the local Python task, run its tests and operation probe, and add your own changed case before recording coding evidence.",
    checks: [
      {
        id: "q1",
        question:
          "Two separate full scans do 2n visits. What is the usual class?",
        options: [
          "Linear growth with input size",
          "Quadratic growth with input size",
          "Constant growth with input size",
          "Exponential growth with input size",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback: "Add sequential costs: n+n stays in the linear family.",
      },
      {
        id: "q2",
        question: "An n-sized loop contains a three-step loop. What grows?",
        options: [
          "Three times n body visits",
          "n times n body visits",
          "Only three total body visits",
          "Two raised-to-n total body visits",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "A fixed inner bound is a constant multiplier, not another growing n.",
      },
    ],
    review: {
      question:
        "Two independent lists have n and m items. Every pair is inspected. Which bound retains both sizes?",
      options: [
        "O(1) fixed total ordered pair work",
        "O(log n) fixed total pair work",
        "O(n × m) total pair work",
        "O(n + m) total pair work",
      ],
      answer: 2,
      feedback:
        "Keep independent input sizes separate instead of assuming they are equal.",
    },
  },
  "cx-halving": {
    recall:
      "How many times can you halve 16 candidates until only one remains? What property must the candidates have to discard half safely?",
    reflection:
      "Define n (and any second input size), state the case and cost assumptions, count the growing work, and separately explain storage. Record your command, observed counts, changed case, and help used.",
    evidence:
      "Predict the count model, implement the local Python task, run its tests and operation probe, and add your own changed case before recording coding evidence.",
    checks: [
      {
        id: "q1",
        question: "Why may binary search safely discard one half?",
        options: [
          "The input order gives direction",
          "Every input has unique values",
          "The Python GIL stores indices",
          "The list always fits cache",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback: "Sorted order lets a midpoint comparison rule out one side.",
      },
      {
        id: "q2",
        question: "Doubling n changes log₂ n by how much?",
        options: [
          "One additional halving level",
          "Twice the previous count",
          "n additional halving levels",
          "No additional halving level",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "log₂(2n)=log₂(n)+1. This concerns growth, not exact seconds.",
      },
    ],
    review: {
      question:
        "You sort unsorted data before one binary search. Which cost must you include?",
      options: [
        "Neither operation changes total work",
        "Both sorting and subsequent searching",
        "Only the final midpoint comparison",
        "Only reading the returned index",
      ],
      answer: 1,
      feedback: "A preprocessing step belongs in the end-to-end cost.",
    },
  },
  "cx-python-costs": {
    recall:
      "Is x in a_list constant work because it is one Python expression? What does a_list[:] create?",
    reflection:
      "Define n (and any second input size), state the case and cost assumptions, count the growing work, and separately explain storage. Record your command, observed counts, changed case, and help used.",
    evidence:
      "Predict the count model, implement the local Python task, run its tests and operation probe, and add your own changed case before recording coding evidence.",
    checks: [
      {
        id: "q1",
        question: "A list slice copies k references. What scales with k?",
        options: [
          "Its work and result storage",
          "Only its Python source length",
          "Nothing because slicing is builtin",
          "Only the installed package count",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "Builtins perform real work; copying k references has linear cost in k.",
      },
      {
        id: "q2",
        question: "What does amortized O(1) append mean?",
        options: [
          "Constant average across many appends",
          "Every individual append is identical",
          "No append can trigger resizing",
          "Appending never retains more memory",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "Some appends resize; their cost is spread over a sequence, not guaranteed per call.",
      },
    ],
    review: {
      question:
        "Which claim about set lookup is accurate under ordinary hashing?",
      options: [
        "Expected constant, with worse cases",
        "Guaranteed constant for every key",
        "Always linear for every lookup",
        "Independent of every equality cost",
      ],
      answer: 0,
      feedback:
        "Expected constant lookup needs a key/collision cost model; worst cases still exist.",
    },
  },
  "cx-space": {
    recall:
      "If a function returns n new values, can its total output memory be constant? What state does a generator retain?",
    reflection:
      "Define n (and any second input size), state the case and cost assumptions, count the growing work, and separately explain storage. Record your command, observed counts, changed case, and help used.",
    evidence:
      "Predict the count model, implement the local Python task, run its tests and operation probe, and add your own changed case before recording coding evidence.",
    checks: [
      {
        id: "q1",
        question: "Returning n new results as a list needs which output space?",
        options: [
          "Linear output storage in n",
          "Constant output storage in n",
          "Logarithmic output storage in n",
          "No output storage is required",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback: "The returned list must retain its n output references.",
      },
      {
        id: "q2",
        question: "A generator remembers every distinct ID. What can grow?",
        options: [
          "Its retained set of IDs",
          "Only one fixed iterator slot",
          "No state beyond the caller",
          "Only the source code length",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "Laziness does not bound a growing accumulator such as a seen set.",
      },
    ],
    review: {
      question:
        "A running sum returns one number with small fixed-size values. Which auxiliary storage is needed?",
      options: [
        "Linear list of every result",
        "Quadratic table of all pairs",
        "Exponential list of every subset",
        "Constant accumulator and loop state",
      ],
      answer: 3,
      feedback:
        "Under the stated small-number model, the accumulator and loop state do not scale with n.",
    },
  },
  "cx-indexing": {
    recall:
      "If n customers each scan m orders, how many order visits occur? What could be stored to avoid repeating the scan?",
    reflection:
      "Define n (and any second input size), state the case and cost assumptions, count the growing work, and separately explain storage. Record your command, observed counts, changed case, and help used.",
    evidence:
      "Predict the count model, implement the local Python task, run its tests and operation probe, and add your own changed case before recording coding evidence.",
    checks: [
      {
        id: "q1",
        question:
          "n customers each rescan m orders. How many order visits occur?",
        options: [
          "n times m order visits",
          "n plus m order visits",
          "Only m total order visits",
          "Only n total order visits",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback: "The order scan is repeated once for every customer.",
      },
      {
        id: "q2",
        question: "What is the main tradeoff of a totals dictionary?",
        options: [
          "Extra storage avoids repeated scanning",
          "Less storage guarantees slower scanning",
          "Hashing removes all preprocessing work",
          "Every possible input becomes constant",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "The index uses growing memory and setup work to reduce repeated searches.",
      },
    ],
    review: {
      question:
        "One order pass builds an index, then n customers query it. What is the expected work under ordinary hashing?",
      options: [
        "Constant regardless of both inputs",
        "Exponential in both input lengths",
        "Linear in m plus n",
        "Quadratic in m times n",
      ],
      answer: 2,
      feedback: "Include both the m-order build and n-customer lookup phase.",
    },
  },
  "cx-sorting": {
    recall:
      "If each merge level touches n values and there are roughly log₂ n levels, what grows overall?",
    reflection:
      "Define n (and any second input size), state the case and cost assumptions, count the growing work, and separately explain storage. Record your command, observed counts, changed case, and help used.",
    evidence:
      "Predict the count model, implement the local Python task, run its tests and operation probe, and add your own changed case before recording coding evidence.",
    checks: [
      {
        id: "q1",
        question:
          "log₂ n merge levels each do O(n) work. What is the combined usual bound?",
        options: [
          "O(n log n) merge-sort work",
          "O(log n) entire sorting work",
          "O(1) fixed entire sorting work",
          "O(n²) unavoidable total merge-sort work",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback: "Multiply the work per level by the number of levels.",
      },
      {
        id: "q2",
        question: "What does 2ⁿ count for n distinct yes/no choices?",
        options: [
          "The possible subsets of choices",
          "The sorted list midpoint probes",
          "The slots in one accumulator",
          "The fixed cost of indexing",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "Each extra yes/no choice doubles the number of subsets, before considering copying each output.",
      },
    ],
    review: {
      question:
        "Merging lists of lengths a and b emits each item once. Which time bound fits?",
      options: [
        "O(2ᵃ) exponential whole merge time",
        "O(a + b) merge time",
        "O(a × b) merge time",
        "O(1) fixed total merge time",
      ],
      answer: 1,
      feedback:
        "The indices advance across a+b items without restarting either scan.",
    },
  },
  "cx-review": {
    recall:
      "Before naming a complexity, can you state the input size, case, counted operation, hidden calls, and retained state?",
    reflection:
      "Define n (and any second input size), state the case and cost assumptions, count the growing work, and separately explain storage. Record your command, observed counts, changed case, and help used.",
    evidence:
      "Predict the count model, implement the local Python task, run its tests and operation probe, and add your own changed case before recording coding evidence.",
    checks: [
      {
        id: "q1",
        question: "What should you define before assigning a complexity?",
        options: [
          "Input size, case, and cost model",
          "Only the number of source lines",
          "Only the machine CPU clock speed",
          "Only the final printed return value",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "An unqualified complexity label can conceal which input and case it describes.",
      },
      {
        id: "q2",
        question:
          "Both duplicate detectors return correct results. What can still differ?",
        options: [
          "Their growing work and storage",
          "Whether Python accepts the syntax",
          "Whether booleans can represent results",
          "Whether inputs have a length",
        ],
        answer: 0,
        hint: "Name the input size and counted operation, then trace a small example before generalizing.",
        feedback:
          "Correctness is necessary; the algorithms can still have different cost and resource behaviour.",
      },
    ],
    review: {
      question:
        "A set-based solution is linear on ordinary distinct hashes. What is the honest conclusion?",
      options: [
        "Expected linear under stated hashing assumptions",
        "Guaranteed linear for every custom key",
        "Constant memory for any input size",
        "Every benchmark proves all asymptotic bounds",
      ],
      answer: 0,
      feedback:
        "Keep expected behaviour, collision assumptions, and bounded observations explicit.",
    },
  },
};
