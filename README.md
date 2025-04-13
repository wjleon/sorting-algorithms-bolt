# Sorting Algorithms Motion Showcase

A dynamic, interactive visualization platform for exploring and comparing various sorting algorithms, developed by [Wilmer Leon](https://medium.com/@wjleon) and powered by Bolt.

![Sorting Algorithms Visualization](https://via.placeholder.com/800x400?text=Sorting+Algorithms+Visualization)

## Overview

This application provides an intuitive and visually engaging way to understand how different sorting algorithms operate. Watch in real-time as algorithms like Bubble Sort, Quick Sort, and Merge Sort rearrange data, with visual and audio feedback to help comprehend the sorting process.

Built with Next.js and React, this project serves as both an educational tool and a demonstration of modern web development techniques.

## Features

- **Interactive Visualization**: Watch algorithms sort data in real-time with customizable speeds
- **Multiple Algorithms**: Compare six different sorting algorithms:
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Merge Sort
  - Quick Sort
  - Heap Sort
- **Configurable Parameters**:
  - Adjust the number of elements (10-200)
  - Change distribution patterns (random, ascending, descending, split patterns)
  - Control animation speed
  - Toggle sound effects
- **Performance Metrics**: Track comparison operations and time elapsed for each algorithm
- **Responsive Design**: Works across desktop and mobile devices

## Algorithm Details

### Bubble Sort
A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.

### Selection Sort
Divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region to add to the sorted region.

### Insertion Sort
Builds the final sorted array one item at a time, by repeatedly inserting a new element into the sorted portion of the array.

### Merge Sort
A divide-and-conquer algorithm that recursively breaks down a list into smaller sublists until each sublist consists of a single element, then merges those sublists to produce a sorted list.

### Quick Sort
A highly efficient, comparison-based algorithm that uses a divide-and-conquer strategy to sort elements by partitioning the array around a pivot element.

### Heap Sort
A comparison-based sorting algorithm that uses a binary heap data structure to build a max-heap and repeatedly extracts the maximum element.

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript for improved developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Headless UI components for accessible web applications
- **Web Audio API**: For generating sound effects based on array values

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/sorting-visualizer.git
cd sorting-visualizer
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Select a sorting algorithm from the dropdown menu
2. Configure the number of elements and their initial distribution
3. Adjust the animation speed as desired
4. Click "Start" to begin the visualization
5. Use "Pause" and "Reset" to control the sorting process
6. Toggle sound effects on/off as preferred

## Educational Value

This project serves as:
- A teaching tool for computer science students learning about sorting algorithms
- A visual reference for understanding algorithm efficiency and behavior
- An interactive demonstration of how different initial distributions affect algorithm performance

## About The Developer

This project was developed by [Wilmer Leon](https://medium.com/@wjleon) with assistance from Bolt, demonstrating effective application of modern web development techniques and algorithm visualization.

## License

MIT

---

Made with ❤️ by Bolt 