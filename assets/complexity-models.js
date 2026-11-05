export function complexityModel(id, n, m = 8) {
  const allowed = id === "cx-sorting" ? [4, 8, 16] : [4, 8, 16, 32, 64, 128];
  if (!allowed.includes(n) || ![4, 8, 16, 32].includes(m)) {
    throw new Error("Choose a prepared input size.");
  }
  const row = (label, count, unit, growth) => ({ label, count, unit, growth });
  const models = {
    "cx-growth": () => ({
      rows: [
        row("Read one known list index", 1, "item reads", "O(1)"),
        row("Scan the entire list", n, "item reads", "O(n)"),
      ],
      note: "n is the list length. Direct indexing uses one selected read; scanning reads all n values. Counts exclude fixed control overhead.",
    }),
    "cx-loops": () => ({
      rows: [
        row("Two separate scans", 2 * n, "body visits", "O(n)"),
        row("n outer, 3 inner", 3 * n, "body visits", "O(n)"),
        row("n outer, n inner", n * n, "pair visits", "O(n²)"),
        row("Only pairs with j > i", (n * (n - 1)) / 2, "pair visits", "O(n²)"),
        row("n outer, m inner", n * m, "pair visits", "O(nm)"),
      ],
      note: "A constant-cost body is assumed. m is independent of n; holding m fixed while varying n does not demonstrate the case where both grow.",
    }),
    "cx-halving": () => {
      let low = 0,
        high = n - 1,
        probes = 0;
      const intervals = [];
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        intervals.push(`[${low}, ${high}] → midpoint ${mid}`);
        probes++;
        low = mid + 1;
      }
      return {
        rows: [
          row("Missing-target full scan", n, "item reads", "O(n) worst case"),
          row(
            "Binary search, target n",
            probes,
            "midpoint reads",
            "O(log n) worst case",
          ),
        ],
        note: `Sorted values are 0…${n - 1}; target ${n} is absent. One read is reused per midpoint. Trace: ${intervals.join("; ")}. No slices or sorting are included.`,
      };
    },
    "cx-python-costs": () => ({
      rows: [
        row("Read the stored list length", 1, "length lookups", "O(1)"),
        row("Missing value in a list", n, "equality checks", "O(n) worst case"),
        row(
          "Copy a half-list slice",
          n / 2,
          "copied references",
          "O(n) when k=n/2",
        ),
      ],
      note: "Each row names its own counted operation. Counts are simplified, not comparable CPU timings. A single Python expression can copy or scan many items.",
    }),
    "cx-space": () => ({
      rows: [
        row(
          "One running accumulator",
          1,
          "conceptual accumulator slots",
          "O(1) auxiliary",
        ),
        row("Retain all transformed results", n, "output slots", "O(n) output"),
        row(
          "Retain every distinct ID",
          n,
          "seen entries, all distinct",
          "O(n) auxiliary",
        ),
      ],
      note: "These are conceptual retained slots, not bytes or RSS. Input storage is excluded. A lazy producer does not prevent its consumer from retaining n outputs.",
    }),
    "cx-indexing": () => ({
      rows: [
        row("n customers each scan m orders", n * m, "order visits", "O(nm)"),
        row(
          "Build once, then query",
          m + n,
          "simplified build/query units",
          "O(m+n) expected",
        ),
      ],
      note: "The indexed model charges one unit per order and customer, omitting fixed field-operation factors. Ordinary fixed-size-key hashing is assumed. The index retains up to m customer entries; output also uses up to n entries.",
    }),
    "cx-sorting": () => {
      let factorial = 1;
      for (let k = 2; k <= n; k++) factorial *= k;
      return {
        rows: [
          row(
            "One merge, n total items",
            n,
            "emitted values",
            "O(n) merge time",
          ),
          row(
            "n × log₂ n curve",
            n * Math.log2(n),
            "illustrative sort work units",
            "O(n log n) family",
          ),
          row(
            "All yes/no subsets",
            2 ** n,
            "candidates only",
            "2ⁿ candidate count",
          ),
          row(
            "All distinct-item orderings",
            factorial,
            "candidates only",
            "n! candidate count",
          ),
        ],
        note: "n is capped at 16. These rows count different things: n log₂ n is a growth curve, not an exact Python sort count; candidate counts exclude the work and storage of copying each output. Tiny bars can be hard to see on a linear scale; read the values.",
      };
    },
    "cx-review": () => ({
      rows: [
        row(
          "Growing-list membership",
          (n * (n - 1)) / 2,
          "equality checks, all distinct",
          "O(n²)",
        ),
        row(
          "Ordinary set membership + insert",
          2 * n,
          "model hash-table operations",
          "O(n) expected",
        ),
      ],
      note: "The set row models two expected constant-cost operations per distinct ID, not exact hash/equality callback counts. All-distinct input is the comparison case. Both approaches retain up to n entries; adversarial collisions can worsen set behaviour.",
    }),
  };
  if (!models[id]) throw new Error("Unknown complexity lesson.");
  return models[id]();
}
