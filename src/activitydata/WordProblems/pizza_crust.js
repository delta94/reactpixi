
import {SCREEN_STATES,SCREEN_TYPES} from '../../js/states.js'
import ICON from '../../assets/NumberLineEquivalenceIcon.png'


const sequence = 
    [{
      slideNumber: 1,
      screenType: SCREEN_TYPES.FULL_PROMPT,
      tips: ["How does Tool A help?","How does Tool B help?"],
    },
]


export const ACTIVITY = {
    ID: "pizza_crust",
    TITLE : "Pizza Crust",
    SCREEN_TYPE: SCREEN_TYPES.PANORAMIC,
    WORD_PROBLEM: true,
    ICON: ICON,
    TIME: 45,
    PAGES: 4,
    TOOL: "/dualarena/cuttinggrid_5x5_and_gridnodes_5x5_desc",
    SCRIPT: "FRACTION_NUMBER_LINE",
    FEATURES: {blocks: true,open: true},
    MENU: ['Link One',"Link Two"],
    SEQUENCE: sequence,
    LONG_DESCRIPTION: "Here is a very long description of what is happeneing in the activity I mean it's so long don't you think? Here is a very long description of what is happeneing in the activity I mean it's so long don't you think? Here is a very long description of what is happeneing in the activity I mean it's so long don't you think?",
    INSTRUCTIONS: 'Students should...',
    STANDARD_ID: "3.NF.A.3.A",
    STANDARD_DESCRIPTION: "Understand two fractions as equivalent (equal) if they are the same size, or the same point on a number line.",
    TAGS: ["Place Value","Addition","First Grade"],
    LEARNING_GOAL: "goal for learning",
    PDF: "/pdfs/wordproblems/PizzaCrust.pdf",
    ORGANIZER: "pdfs/organizers/NumberLineEquivalenceOrganizer.pdf",
    STUDENT_LINKS: [{title: 'Tool',link: '/cutting_and_grid'}],
    OBJECTIVES: ["students can do this","students can also do this"],
    DESCRIPTION: "Understand two fractions as equivalent (equal) if they are the same size, or the same point on a number line.",
    OVERVIEW: [{anchor: "Play",slides: [1,4], description: ['Bullet One','Bullet Two','Bullet Three']},
    {anchor: "Discuss",slides: [5,6],description: ['Bullet One','Bullet Two','Bullet Three']}]
  }
