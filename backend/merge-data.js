const fs = require('fs');
const path = require('path');

const backendCourses = require('./src/data/courses.js');
const frontendCourses = require('../frontend/src/data/courses.json');

// Reconstruct the array to add the missing frontend visual fields
const merged = backendCourses.map(bc => {
  const fc = frontendCourses.find(c => c.id === bc.id);
  
  if (!fc) {
    // If it was uniquely generated in the backend, fallback
    return {
      ...bc,
      difficulty: bc.level,
      formattedPrice: "$" + (bc.price / 100),
      mockIncluded: false,
      coverGradient: 'from-gray-900 to-gray-800',
      outcomes: [],
    };
  }
  
  return {
    ...bc,
    difficulty: fc.difficulty || bc.level,
    formattedPrice: fc.price, 
    mockIncluded: fc.mockIncluded || false,
    coverGradient: fc.coverGradient || 'from-gray-900 to-gray-800',
    coverAccent: fc.coverAccent || '#ffffff',
    outcomes: fc.outcomes || [],
    syllabus: bc.syllabus.map((bSect, i) => {
      const fSect = fc.syllabus[i];
      return {
        ...bSect,
        videoId: fSect ? fSect.videoId : bSect.videoUrl?.split('v=')[1] || null, 
        locked: fSect ? fSect.locked : false,
      };
    })
  };
});

const fileContent = `/**
 * SARASWATI – Courses Catalogue 
 * Merged Backend fully-implemented sections with Frontend Aesthetic tokens
 */

const courses = ${JSON.stringify(merged, null, 2)};

module.exports = courses;
`;

fs.writeFileSync(path.join(__dirname, 'src/data/courses.js'), fileContent);
console.log("Merge completed successfully!");
