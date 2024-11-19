Feature: Specific feature
	Scenario:  Assembling Legodooo 
		Given the position of the robot "Assembler" is "default"
		When the robot "Assembler" moves to position "point2"
		Then the position of the robot "Assembler" is "default"
          
          