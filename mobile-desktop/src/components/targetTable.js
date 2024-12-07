// const landmarkTypes = [
//     { label: 'No Icons', value: 'None' },
//     { label: 'Numbers', value: 'Numbers' },
//     { label: 'Letters', value: 'Letters' },
//     { label: 'Icons', value: 'Icons' },
//     { label: 'ColorIcons', value: 'ColorIcons' },
//   ];


const targetTable = {
    subject1: [
      {
        pdf: "PDF1",
        targets: [
            "target1", "target2", "target3", "target4", "target5",
            "target2", "target3", "target4", "target5", "target1",
            "target3", "target4", "target5", "target1", "target2",
            // "target4", "target5", "target1", "target2", "target3",
            // "target5", "target1", "target2", "target3", "target4"
        ],
        landmarks: "Numbers", // Associated landmark type
      },
      {
        pdf: "PDF2",
        targets: [
            "target6", "target7", "target8", "target9", "target10",
            "target7", "target8", "target9", "target10", "target6",
            "target8", "target9", "target10", "target6", "target7",
            // "target9", "target10", "target6", "target7", "target8",
            // "target10", "target6", "target7", "target8", "target9"
        ],
        landmarks: "No Icons", // Associated landmark type
      },
      {
        pdf: "PDF3",
        targets: [
            "target11", "target12", "target13", "target14", "target15",
            "target12", "target13", "target14", "target15", "target11",
            "target13", "target14", "target15", "target11", "target12",
            // "target14", "target15", "target11", "target12", "target13",
            // "target15", "target11", "target12", "target13", "target14"
        ],
        landmarks: "Letters", // Associated landmark type
      },
      {
        pdf: "PDF4",
        targets: [
            "target20", "target16", "target17", "target18", "target19",
            "target16", "target17", "target18", "target19", "target20",
            "target17", "target18", "target19", "target20", "target16",
            // "target18", "target19", "target20", "target16", "target17",
            // "target19", "target20", "target16", "target17", "target18"
        ],
        landmarks: "Icons", // Associated landmark type
      },
      {
        pdf: "PDF5",
        targets: [
            "target21", "target22", "target23", "target24", "target25",
            "target22", "target23", "target24", "target25", "target21",
            "target23", "target24", "target25", "target21", "target22",
            // "target24", "target25", "target21", "target22", "target23",
            // "target25", "target21", "target22", "target23", "target24"
        ],
        landmarks: "ColorIcons", // Associated landmark type
      },
    ],
    
    subject2: [
        {
            pdf: "PDF1",
            targets: [
                "target1", "target2", "target3", "target4", "target5",
                "target2", "target3", "target4", "target5", "target1",
                "target3", "target4", "target5", "target1", "target2",
                // "target4", "target5", "target1", "target2", "target3",
                // "target5", "target1", "target2", "target3", "target4"
            ],
            landmarks: "No Icons", // Associated landmark type
          },
          {
            pdf: "PDF2",
            targets: [
                "target6", "target7", "target8", "target9", "target10",
                "target7", "target8", "target9", "target10", "target6",
                "target8", "target9", "target10", "target6", "target7",
                // "target9", "target10", "target6", "target7", "target8",
                // "target10", "target6", "target7", "target8", "target9"
            ],
            landmarks: "Letters", // Associated landmark type
          },
          {
            pdf: "PDF3",
            targets: [
                "target11", "target12", "target13", "target14", "target15",
                "target12", "target13", "target14", "target15", "target11",
                "target13", "target14", "target15", "target11", "target12",
                // "target14", "target15", "target11", "target12", "target13",
                // "target15", "target11", "target12", "target13", "target14"
            ],
            landmarks: "Icons", // Associated landmark type
          },
          {
            pdf: "PDF4",
            targets: [
                "target20", "target16", "target17", "target18", "target19",
                "target16", "target17", "target18", "target19", "target20",
                "target17", "target18", "target19", "target20", "target16",
                // "target18", "target19", "target20", "target16", "target17",
                // "target19", "target20", "target16", "target17", "target18"
            ],
            
            landmarks: "ColorIcons", // Associated landmark type
          },
          {
            pdf: "PDF5",
            targets: [
                "target21", "target22", "target23", "target24", "target25",
                "target22", "target23", "target24", "target25", "target21",
                "target23", "target24", "target25", "target21", "target22",
                // "target24", "target25", "target21", "target22", "target23",
                // "target25", "target21", "target22", "target23", "target24"
            ],
            landmarks: "Numbers", // Associated landmark type
          },
        ],
    subject3: [
        {
            pdf: "PDF1",
            targets: [
                ["target1", "target5"]
            ],
            landmarks: "Numbers", 
        },
        {
            pdf: "PDF2",
            targets: [
                ["target7", "target8"]
            ],
            landmarks: "ColorIcons", 
        }
    ]
};

  export default targetTable;