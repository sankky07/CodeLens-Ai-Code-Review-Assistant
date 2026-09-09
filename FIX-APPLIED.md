# AI-Code-Review-Assistant — Fix Applied

This package is based on the uploaded project.

## Fixed
- Corrected the Java compilation error in `ReviewService.java`:
  `append('\n\n')` was an invalid Java character literal and is now `append("\n\n")`.
- The structured AI review implementation already present in the project is preserved.
- The structured response includes a numeric score, so the frontend can display the final score directly instead of extracting it from Markdown.
- Repository review UI is preserved in its structured/collapsible form.

## Before running
Restore your local environment values in:
`backend/src/main/resources/application.properties`

The packaged `application.properties` is sanitized to avoid distributing credentials. Do not commit API keys, OAuth secrets, database passwords, or JWT secrets to Git.

## Run
Backend:
`cd backend`
`mvnw.cmd spring-boot:run`

Frontend:
`cd frontend`
`npm install`
`npm run dev`
