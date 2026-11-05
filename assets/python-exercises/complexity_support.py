"""Instrument selected operations. Counters describe these paths, not universal proofs."""


class CountedSequence:
    def __init__(self, values):
        self.values = list(values)
        self.reads = 0
        self.copied = 0

    def __len__(self):
        return len(self.values)

    def __iter__(self):
        for value in self.values:
            self.reads += 1
            yield value

    def __getitem__(self, index):
        result = self.values[index]
        if isinstance(index, slice):
            self.reads += len(result)
            self.copied += len(result)
        else:
            self.reads += 1
        return result


class CountedRow(dict):
    def __init__(self, row, owner):
        super().__init__(row)
        self.owner = owner

    def __getitem__(self, key):
        self.owner.field_reads += 1
        return super().__getitem__(key)

    def get(self, key, default=None):
        self.owner.field_reads += 1
        return super().get(key, default)


class CountedOrders:
    def __init__(self, rows):
        self.visits = 0
        self.field_reads = 0
        self.rows = [CountedRow(row, self) for row in rows]

    def __iter__(self):
        for row in self.rows:
            self.visits += 1
            yield row


class ComparisonValue:
    def __init__(self, value, counter):
        self.value = value
        self.counter = counter

    def __lt__(self, other):
        self.counter["comparisons"] += 1
        return self.value < other.value

    def __le__(self, other):
        self.counter["comparisons"] += 1
        return self.value <= other.value


class HashingValue:
    def __init__(self, value, counter, collide=False):
        self.value = value
        self.counter = counter
        self.collide = collide

    def __hash__(self):
        self.counter["hashes"] += 1
        return 0 if self.collide else hash(self.value)

    def __eq__(self, other):
        self.counter["comparisons"] += 1
        if not isinstance(other, HashingValue):
            return NotImplemented
        return self.value == other.value
