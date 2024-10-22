const jsonData = {
    name: "Robot Arm",
    scenarios: [
      {
        id: 1,
        name: "Scenario Assembling Lego",
        duration: 1.22,
        givens: [
          {
            text: "The Robot arm is position 'default'",
            duration: 0.22,
            failure: false,
            skipped: false
          }
        ],
        whens: [
          {
            text: "The Robot arm moves to position 'point1'",
            duration: 1.0,
            failure: false,
            skipped: false
          }
        ],
        thens: [
          {
            text: "The Robot arm is at position 'point1'",
            duration: 0.0,
            failure: false,
            skipped: false
          }
        ]
      }
    ]
};