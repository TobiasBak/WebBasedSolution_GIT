package dk.sdu.bdd.xtext.web.services;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/run-scenario")
public class ScenarioRunServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            // Get the root path of the web application
            String rootPath = getServletContext().getRealPath("/");

            // Construct the path to the Python script
            String relativePath = "../../dk.sdu.bdd.xtext.examples/src/dk/sdu/bdd/xtext/examples/features/main.py";
            String absoluteFilePath = new File(rootPath, relativePath).getCanonicalPath();

            // Log the absolute path to the script
            //System.out.println("Absolute path to script: " + absoluteFilePath);

            // Create the process builder with the absolute path to main.py
            List<String> command = new ArrayList<>();
            command.add("python"); // Adjust this if Python is not in the system PATH
            command.add(absoluteFilePath);

            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true); // Combine error and output streams

            // Start the process
            Process process = processBuilder.start();

            // Capture and log the output
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                    System.out.println(line); // Log to Eclipse console
                }
            }

            // Wait for the process to complete
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("Scenario run successfully:\n" + output.toString());
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Error running scenario. Exit code: " + exitCode + "\nOutput:\n" + output.toString());
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the error to the console
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error running scenario: " + e.getMessage() + "\n");
        }
    }
}
