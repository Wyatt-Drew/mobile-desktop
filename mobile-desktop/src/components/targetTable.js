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
                ["target1", "target3", "target4"],
                ["target3", "target4", "target1"],
                ["target4", "target1", "target3"]
            ],
            landmarks: "Numbers",
        },
        {
            pdf: "PDF2",
            targets: [
                ["target6", "target8", "target9"],
                ["target8", "target9", "target6"],
                ["target9", "target6", "target8"]
            ],
            landmarks: "No Icons",
        },
        {
            pdf: "PDF3",
            targets: [
                ["target11", "target13", "target15"],
                ["target13", "target15", "target11"],
                ["target15", "target11", "target13"]
            ],
            landmarks: "Letters", 
        },
        {
            pdf: "PDF4",
            targets: [
                ["target16", "target18", "target20"],
                ["target18", "target20", "target16"],
                ["target20", "target16", "target18"]
            ],
            landmarks: "Icons", 
        },
        {
            pdf: "PDF5",
            targets: [
                ["target21", "target22", "target24"],
                ["target22", "target24", "target21"],
                ["target24", "target21", "target22"]
            ],
            landmarks: "ColorIcons",
        },
    ],
    subject2: [
        {
            pdf: "PDF1",
            targets: [
                ["target1", "target3", "target4"],
                ["target3", "target4", "target1"],
                ["target4", "target1", "target3"]
            ],
            landmarks: "No Icons", 
        },
        {
            pdf: "PDF2",
            targets: [
                ["target6", "target8", "target9"],
                ["target8", "target9", "target6"],
                ["target9", "target6", "target8"]
            ],
            landmarks: "Letters", 
        },
        {
            pdf: "PDF3",
            targets: [
                ["target11", "target13", "target15"],
                ["target13", "target15", "target11"],
                ["target15", "target11", "target13"]
            ],
            landmarks: "Icons", 
        },
        {
            pdf: "PDF4",
            targets: [
                ["target16", "target18", "target20"],
                ["target18", "target20", "target16"],
                ["target20", "target16", "target18"]
            ],
            landmarks: "ColorIcons", 
        },
        {
            pdf: "PDF5",
            targets: [
                ["target21", "target22", "target24"],
                ["target22", "target24", "target21"],
                ["target24", "target21", "target22"]
            ],
            landmarks: "Numbers",
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