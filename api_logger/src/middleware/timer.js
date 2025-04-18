export default function timer(data) {
    const start = performance.now();
    setTimeout(() => {
      const elapsed = performance.now() - start;
      data.elapsed = `${elapsed.toFixed(1)} ms`;
      console.log("⏱ Timer terminé :", data.elapsed);
    }, 1000);
  }