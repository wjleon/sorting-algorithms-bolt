interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
}

type SortingGenerator = Generator<SortingStep, void, unknown>;

function* bubbleSort(arr: number[]): SortingGenerator {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: arr, comparing: [j, j + 1], swapping: [] };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { array: arr, comparing: [], swapping: [j, j + 1] };
      }
    }
  }
}

function* selectionSort(arr: number[]): SortingGenerator {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: arr, comparing: [minIdx, j], swapping: [] };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { array: arr, comparing: [], swapping: [i, minIdx] };
    }
  }
}

function* insertionSort(arr: number[]): SortingGenerator {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0) {
      yield { array: arr, comparing: [j, j + 1], swapping: [] };
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        yield { array: arr, comparing: [], swapping: [j, j + 1] };
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    yield { array: arr, comparing: [], swapping: [j + 1] };
  }
}

function* merge(arr: number[], left: number, mid: number, right: number): SortingGenerator {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  while (i < n1 && j < n2) {
    yield { array: arr, comparing: [left + i, mid + 1 + j], swapping: [] };
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      yield { array: arr, comparing: [], swapping: [k] };
      i++;
    } else {
      arr[k] = R[j];
      yield { array: arr, comparing: [], swapping: [k] };
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    yield { array: arr, comparing: [], swapping: [k] };
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    yield { array: arr, comparing: [], swapping: [k] };
    j++;
    k++;
  }
}

function* mergeSort(arr: number[], left = 0, right = arr.length - 1): SortingGenerator {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    yield* mergeSort(arr, left, mid);
    yield* mergeSort(arr, mid + 1, right);
    yield* merge(arr, left, mid, right);
  }
}

function* quickSort(arr: number[], low = 0, high = arr.length - 1): SortingGenerator {
  if (low < high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      yield { array: arr, comparing: [j, high], swapping: [] };
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { array: arr, comparing: [], swapping: [i, j] };
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield { array: arr, comparing: [], swapping: [i + 1, high] };

    const pi = i + 1;

    yield* quickSort(arr, low, pi - 1);
    yield* quickSort(arr, pi + 1, high);
  }
}

function* heapify(arr: number[], n: number, i: number): SortingGenerator {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  yield { array: arr, comparing: [largest, left], swapping: [] };
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  yield { array: arr, comparing: [largest, right], swapping: [] };
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield { array: arr, comparing: [], swapping: [i, largest] };
    yield* heapify(arr, n, largest);
  }
}

function* heapSort(arr: number[]): SortingGenerator {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { array: arr, comparing: [], swapping: [0, i] };
    yield* heapify(arr, i, 0);
  }
}

export const algorithms: Record<string, { name: string; description: string; generator: (arr: number[]) => SortingGenerator }> = {
  bubble: {
    name: 'Bubble Sort',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    generator: bubbleSort,
  },
  selection: {
    name: 'Selection Sort',
    description: 'Divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region to add to the sorted region.',
    generator: selectionSort,
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time, by repeatedly inserting a new element into the sorted portion of the array.',
    generator: insertionSort,
  },
  merge: {
    name: 'Merge Sort',
    description: 'A divide-and-conquer algorithm that recursively breaks down a list into smaller sublists until each sublist consists of a single element, then merges those sublists to produce a sorted list.',
    generator: mergeSort,
  },
  quick: {
    name: 'Quick Sort',
    description: 'A highly efficient, comparison-based algorithm that uses a divide-and-conquer strategy to sort elements by partitioning the array around a pivot element.',
    generator: quickSort,
  },
  heap: {
    name: 'Heap Sort',
    description: 'A comparison-based sorting algorithm that uses a binary heap data structure to build a max-heap and repeatedly extracts the maximum element.',
    generator: heapSort,
  }
};