		
		
		
		
@specificFeature
Feature: Specific Feature	
	Scenario: "Assembling Lego"
		Given the position of the robot "Assembler" is "default"
		And god is not real
		When the robot "Assembler" moves to position "point2"
		Then the position of the robot "Assembler" is "point2"

	Scenario: "Dissasembling Lego"
		Given the position of the robot "Assembler" is "default"
		And god is not real
		When the robot "Assembler" moves to position "point2"
		Then the position of the robot "Assembler" is "point2"
		          