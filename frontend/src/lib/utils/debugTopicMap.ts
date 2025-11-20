/**
 * Debug utility to identify topic name mismatches between frontend and backend
 */

const normalize = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "").replace(/-/g, "").trim();
};

export async function debugTopicMapMatching(frontendTopics: string[]) {
  try {
    const res = await fetch("http://localhost:8000/api/leetcode/topic-map");
    if (!res.ok) {
      console.error("[Debug] Failed to fetch topic map");
      return;
    }

    const backendMap = await res.json();
    const backendTopics = Object.keys(backendMap);

    console.group("🔍 Topic Map Debug");

    // Check frontend topics missing from backend
    const missingInBackend = frontendTopics.filter((feTopic) => {
      const normalized = normalize(feTopic);
      return !backendTopics.some((beTopic) => normalize(beTopic) === normalized);
    });

    if (missingInBackend.length > 0) {
      console.warn("❌ Frontend topics missing from backend:", missingInBackend);
    } else {
      console.log("✅ All frontend topics found in backend");
    }

    // Check backend topics not in frontend
    const missingInFrontend = backendTopics.filter((beTopic) => {
      const normalized = normalize(beTopic);
      return !frontendTopics.some((feTopic) => normalize(feTopic) === normalized);
    });

    if (missingInFrontend.length > 0) {
      console.warn("⚠️ Backend topics not in frontend:", missingInFrontend);
    }

    // Show exact name differences
    console.group("📝 Name Comparison (first 10)");
    frontendTopics.slice(0, 10).forEach((feTopic) => {
      const normalized = normalize(feTopic);
      const matchingBeTopic = backendTopics.find(
        (beTopic) => normalize(beTopic) === normalized
      );

      if (matchingBeTopic && matchingBeTopic !== feTopic) {
        console.log(`FE: "${feTopic}" → BE: "${matchingBeTopic}"`);
      }
    });
    console.groupEnd();

    // Show normalization examples
    console.group("🔧 Normalization Examples");
    const examples = [
      "Rejection Sampling",
      "Binary Indexed Tree",
      "Doubly-Linked List",
      "Hash Table",
    ];
    examples.forEach((topic) => {
      console.log(`"${topic}" → "${normalize(topic)}"`);
    });
    console.groupEnd();

    console.groupEnd();
  } catch (error) {
    console.error("[Debug] Error:", error);
  }
}
