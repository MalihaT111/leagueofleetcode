// Normalize topic names for matching
const normalize = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "").replace(/-/g, "").trim();
};

// Map frontend topic names to backend topic names
// Note: Frontend now uses "Sort" to match backend exactly
const TOPIC_ALIAS_MAP: Record<string, string> = {
  "Merge Sort": "Merge Sort",
  "Bucket Sort": "Bucket Sort",
  "Radix Sort": "Radix Sort",
  "Iterator": "Iterator",
  "Shell": "Shell",
  "Topological Sort": "Topological Sort",
  "Quickselect": "Quickselect",
  "Binary Indexed Tree": "Binary Indexed Tree",
  "Line Sweep": "Line Sweep",
  "Monotonic Queue": "Monotonic Queue",
  "Eulerian Circuit": "Eulerian Circuit",
  "Bitmask": "Bitmask",
  "Randomized": "Randomized",
  "Reservoir Sampling": "Reservoir Sampling",
  "Shortest Path": "Shortest Path",
  "Rejection Sampling": "Rejection Sampling",
  "Probability and Statistics": "Probability and Statistics",
  "Suffix Array": "Suffix Array",
  "Concurrency": "Concurrency",
  "Minimum Spanning Tree": "Minimum Spanning Tree",
  "Biconnected Component": "Biconnected Component",
  "Strongly Connected Component": "Strongly Connected Component",
};

export async function validateUserSettings(userId: number): Promise<{
  canMatch: boolean;
  errorMessage: string | null;
}> {
  try {
    // Fetch user settings
    const settingsRes = await fetch(`http://127.0.0.1:8000/api/settings/${userId}`);
    if (!settingsRes.ok) throw new Error("Failed to fetch settings");
    const settings = await settingsRes.json();

    // Check for no difficulties
    if (!settings.difficulty || settings.difficulty.length === 0) {
      if (!settings.topics || settings.topics.length === 0) {
        return {
          canMatch: false,
          errorMessage: "Select at least one topic and one difficulty.",
        };
      }
      return {
        canMatch: false,
        errorMessage: "Select at least one difficulty.",
      };
    }

    // Check for no topics
    if (!settings.topics || settings.topics.length === 0) {
      return {
        canMatch: false,
        errorMessage: "Select at least one topic.",
      };
    }

    // Check for invalid difficulty values
    const validDifficultyValues = [1, 2, 3];
    const hasInvalidDifficulty = settings.difficulty.some(
      (d: number) => !validDifficultyValues.includes(d)
    );
    if (hasInvalidDifficulty) {
      return {
        canMatch: false,
        errorMessage: "Your difficulty selection is invalid.",
      };
    }

    // Fetch disallowed map
    const mapRes = await fetch("http://localhost:8000/api/leetcode/topic-map");
    if (!mapRes.ok) {
      return {
        canMatch: false,
        errorMessage: "Topic availability data is missing. Refresh topic map and try again.",
      };
    }
    const rawDisallowedMap = await mapRes.json();

    // Check if map is empty
    if (!rawDisallowedMap || Object.keys(rawDisallowedMap).length === 0) {
      return {
        canMatch: false,
        errorMessage: "Topic availability data is missing. Refresh topic map and try again.",
      };
    }

    // Normalize all keys in the disallowed map
    const disallowedMap: { [key: string]: string[] } = {};
    for (const key in rawDisallowedMap) {
      disallowedMap[normalize(key)] = rawDisallowedMap[key];
    }

    // Validate topic/difficulty combinations
    const difficultyMap: { [key: number]: string } = {
      1: "EASY",
      2: "MEDIUM",
      3: "HARD",
    };

    const topicNames = [
      "Array", "String", "Hash Table", "Math", "Dynamic Programming",
      "Sorting", "Greedy", "Depth-First Search", "Binary Search", "Database",
      "Matrix", "Bit Manipulation", "Tree", "Breadth-First Search", "Two Pointers",
      "Prefix Sum", "Heap (Priority Queue)", "Simulation", "Binary Tree", "Graph",
      "Counting", "Stack", "Sliding Window", "Design", "Enumeration",
      "Backtracking", "Union Find", "Number Theory", "Linked List", "Ordered Set",
      "Monotonic Stack", "Segment Tree", "Trie", "Combinatorics", "Bitmask",
      "Divide and Conquer", "Queue", "Recursion", "Geometry", "Binary Indexed Tree",
      "Memoization", "Hash Function", "Binary Search Tree", "Shortest Path",
      "String Matching", "Topological Sort", "Rolling Hash", "Game Theory",
      "Interactive", "Data Stream", "Monotonic Queue", "Brainteaser",
      "Doubly-Linked List", "Randomized", "Merge Sort", "Counting Sort",
      "Iterator", "Concurrency", "Line Sweep", "Probability and Statistics",
      "Quickselect", "Suffix Array", "Minimum Spanning Tree", "Bucket Sort",
      "Shell", "Reservoir Sampling", "Strongly Connected Component",
      "Eulerian Circuit", "Radix Sort", "Rejection Sampling", "Biconnected Component",
    ];

    const selectedDifficultyStrings = settings.difficulty.map(
      (d: number) => difficultyMap[d]
    );

    let validTopicCount = 0;
    const invalidTopics: string[] = [];

    for (const topicIdx of settings.topics) {
      const topicName = topicNames[topicIdx];
      
      // Use alias map to get backend topic name, then normalize
      const backendTopicName = TOPIC_ALIAS_MAP[topicName] ?? topicName;
      const normalizedTopicName = normalize(backendTopicName);
      const disallowed = disallowedMap[normalizedTopicName];

      // If not in disallowed map, it's valid
      if (!disallowed) {
        validTopicCount++;
        continue;
      }

      // Backend returns DISALLOWED difficulties (missing from LeetCode)
      // A topic is invalid only if ALL selected difficulties are disallowed
      const allDisallowed = selectedDifficultyStrings.every((diff: string) =>
        disallowed.includes(diff)
      );

      if (allDisallowed) {
        invalidTopics.push(topicName);
      } else {
        validTopicCount++;
      }
    }

    // Hard block: ALL topics are invalid
    if (validTopicCount === 0 && invalidTopics.length > 0) {
      return {
        canMatch: false,
        errorMessage: `All selected topics are incompatible with your difficulty choices: ${invalidTopics.join(", ")}`,
      };
    }

    // Soft block or valid: at least one valid topic exists
    return {
      canMatch: true,
      errorMessage: null,
    };
  } catch (error) {
    console.error("Settings validation failed:", error);
    return {
      canMatch: false,
      errorMessage: "Failed to validate settings. Please try again.",
    };
  }
}
