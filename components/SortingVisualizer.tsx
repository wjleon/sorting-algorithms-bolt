'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { algorithms } from '@/lib/sorting/algorithms';
import { cn } from '@/lib/utils';

type Distribution = 'random' | 'ascending' | 'descending' | 'split-ascending' | 'split-descending';

export default function SortingVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [numElements, setNumElements] = useState(30);
  const [distribution, setDistribution] = useState<Distribution>('random');
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speed, setSpeed] = useState(50);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const sortingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateArray();
    return () => {
      if (sortingTimeoutRef.current) {
        clearTimeout(sortingTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [numElements, distribution]);

  const generateArray = () => {
    let newArray = Array.from({ length: numElements }, (_, i) => i + 1);

    switch (distribution) {
      case 'random':
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        break;
      case 'ascending':
        break;
      case 'descending':
        newArray.reverse();
        break;
      case 'split-ascending':
        const mid = Math.floor(newArray.length / 2);
        newArray = [...newArray.slice(0, mid), ...newArray.slice(mid).reverse()];
        break;
      case 'split-descending':
        const middle = Math.floor(newArray.length / 2);
        newArray = [...newArray.slice(0, middle).reverse(), ...newArray.slice(middle)];
        break;
    }

    setArray(newArray);
    setCompleted(false);
    setComparisons(0);
    setTimeElapsed(0);
  };

  const playTone = (frequency: number) => {
    if (!soundEnabled) return;
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.1);
    oscillator.stop(audioContext.current.currentTime + 0.1);
  };

  const startSorting = async () => {
    if (sorting && paused) {
      setPaused(false);
      return;
    }

    setSorting(true);
    setCompleted(false);
    startTimeRef.current = Date.now();

    const algorithm = algorithms[selectedAlgorithm].generator;
    const generator = algorithm(array.slice());

    const animate = async () => {
      if (paused) {
        return;
      }

      const result = generator.next();
      if (!result.done) {
        const { array: newArray, comparing: comp, swapping: swap } = result.value;
        setArray(newArray);
        setComparing(comp);
        setSwapping(swap);
        setComparisons((prev) => prev + 1);
        
        if (soundEnabled && swap.length) {
          playTone(200 + (newArray[swap[0]] * 2));
        }

        const delay = Math.max(5, 1000 / speed);
        sortingTimeoutRef.current = setTimeout(animate, delay);
      } else {
        setSorting(false);
        setCompleted(true);
        setComparing([]);
        setSwapping([]);
      }

      setTimeElapsed((Date.now() - startTimeRef.current) / 1000);
    };

    animate();
  };

  const pauseSorting = () => {
    setPaused(true);
    if (sortingTimeoutRef.current) {
      clearTimeout(sortingTimeoutRef.current);
    }
  };

  const resetSorting = () => {
    setSorting(false);
    setPaused(false);
    setCompleted(false);
    setComparisons(0);
    setTimeElapsed(0);
    setComparing([]);
    setSwapping([]);
    if (sortingTimeoutRef.current) {
      clearTimeout(sortingTimeoutRef.current);
    }
    generateArray();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1800px] mx-auto">
      <Card className="lg:col-span-3 p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Configuration</h2>
          
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bubble">Bubble Sort</SelectItem>
                <SelectItem value="selection">Selection Sort</SelectItem>
                <SelectItem value="insertion">Insertion Sort</SelectItem>
                <SelectItem value="merge">Merge Sort</SelectItem>
                <SelectItem value="quick">Quick Sort</SelectItem>
                <SelectItem value="heap">Heap Sort</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Number of Elements</Label>
            <Input
              type="number"
              min={10}
              max={200}
              value={numElements}
              onChange={(e) => setNumElements(Math.min(200, Math.max(10, parseInt(e.target.value) || 10)))}
            />
          </div>

          <div className="space-y-2">
            <Label>Distribution</Label>
            <RadioGroup value={distribution} onValueChange={(value: Distribution) => setDistribution(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random">Random</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ascending" id="ascending" />
                <Label htmlFor="ascending">Ascending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="descending" id="descending" />
                <Label htmlFor="descending">Descending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="split-ascending" id="split-ascending" />
                <Label htmlFor="split-ascending">Split Ascending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="split-descending" id="split-descending" />
                <Label htmlFor="split-descending">Split Descending</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Animation Speed</Label>
            <Slider
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              min={1}
              max={100}
              step={1}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
            <Label>Sound Effects</Label>
            {soundEnabled ? <Volume2 className="h-4 w-4 ml-2" /> : <VolumeX className="h-4 w-4 ml-2" />}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold">Algorithm Description</h3>
          <p className="text-sm text-muted-foreground">
            {algorithms[selectedAlgorithm].description}
          </p>
        </div>
      </Card>

      <Card className="lg:col-span-9 p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-center mb-4">
              Sorting Algorithms Motion Showcase by{' '}
              <a 
                href="https://medium.com/@wjleon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                Wilmer Leon
              </a>
            </h1>
            <h2 className="text-2xl font-bold text-center">
              Sorting {numElements} Elements with {algorithms[selectedAlgorithm].name} - Made with Bolt
            </h2>
            <div className="flex justify-center space-x-4 text-sm">
              <span>Comparisons: {comparisons}</span>
              <span>Time: {timeElapsed.toFixed(3)}s</span>
            </div>
          </div>

          <div className="h-[400px] relative flex items-end justify-center space-x-[1px]">
            {array.map((value, index) => (
              <div
                key={index}
                className={cn(
                  "w-full transition-all duration-100",
                  comparing.includes(index) && "bg-yellow-500",
                  swapping.includes(index) && "bg-red-500",
                  !comparing.includes(index) && !swapping.includes(index) && "bg-primary",
                  completed && "bg-green-500"
                )}
                style={{
                  height: `${(value / numElements) * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={startSorting}
              disabled={sorting && !paused}
            >
              <Play className="h-4 w-4 mr-2" />
              {paused ? 'Resume' : 'Start'}
            </Button>
            <Button
              onClick={pauseSorting}
              disabled={!sorting || paused}
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button
              onClick={resetSorting}
              variant="outline"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {completed && (
            <p className="text-center text-green-600 dark:text-green-400">
              Finished sorting {numElements} elements with {algorithms[selectedAlgorithm].name}.
              Number of comparisons: {comparisons}, Time: {timeElapsed.toFixed(3)} seconds.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}