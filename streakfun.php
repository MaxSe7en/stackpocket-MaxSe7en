function isStreak($drawNumber, $streakLength) {
  $sortedDrawNumbers = array_values(sort($drawNumber));
  
  for ($i = 0; $i < count($sortedDrawNumbers); $i++) {
    $count = 1;
    $currentIndex = $i;
    
    for ($j = 0; $j < $streakLength - 1; $j++) {
      $nextIndex = ($currentIndex + 1) % count($sortedDrawNumbers);
      
      if ($sortedDrawNumbers[$nextIndex] === $sortedDrawNumbers[$currentIndex] + 1 || 
         ($sortedDrawNumbers[$nextIndex] === 0 && $sortedDrawNumbers[$currentIndex] === 9)) {
        $count++;
        $currentIndex = $nextIndex;
      } else {
        break;
      }
    }
    
    if ($count === $streakLength) {
      return true;
    }
  }
  
  return false;
}