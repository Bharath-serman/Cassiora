# Compiler Service

A secure, self-hosted code execution microservice for Python, Java, C, and C++. Designed for use in coding tests, online judges, and educational platforms.

## Features
- Supports Python, Java, C, and C++
- Accepts code, language, and test cases via HTTP POST
- Compiles (if needed), runs code, and returns output for each test case
- Runs each submission in a temporary file and directory
- Intended to be run inside a Docker container for security

## API Usage

### Endpoint
POST `/api/compile`

#### Request Body
```
{
  "code": "<user code>",
  "language": "python" | "java" | "c" | "cpp",
  "testCases": [
    { "input": "input string", "expectedOutput": "output string" },
    ...
  ]
}
```

#### Response
```
{
  "results": [
    {
      "input": "...",
      "output": "...",
      "expectedOutput": "...",
      "passed": true/false,
      "error": "compile/runtime error if any"
    },
    ...
  ]
}
```

## Local Development

1. **Build Docker image**
   ```sh
   docker build -t compiler-service .
   ```
2. **Run the service**
   ```sh
   docker run --rm -p 3002:3002 compiler-service
   ```
3. **Test the API**
   You can use Postman, curl, or your frontend to POST to `http://localhost:3002/api/compile`.

## Security Notes
- Always run this service in a container or VM, never directly on your production host.
- The service uses `timeout` to limit execution time, but you should also use Docker resource limits for CPU and RAM.
- For production, consider additional sandboxing (e.g., seccomp, AppArmor, firejail).

## Requirements
- Docker
- (Optional for local testing) Node.js 20+, Python 3, OpenJDK 17, GCC, G++

---

**This service is completely free and open source.**
