const spawn = (args, options) => {
  const shell = "/bin/sh";
  const subprocess = Bun.spawn(["unbuffer", "-p", shell, ...args], {
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  });

  const decoder = new TextDecoder(options.encoding || "utf-8");
  let cols = options.cols;
  let rows = options.rows;
  subprocess.stdin.write(`stty cols ${cols}\n`);
  subprocess.stdin.write(`stty rows ${rows}\n`);
  subprocess.stdin.write("stty echo\n");

  return {
    cols,
    rows,
    onData: (cb) => {
      const reader = subprocess.stdout.getReader();
      new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              cb(decoder.decode(value));
              push();
            });
          }
          push();
        },
      });
    },
    write: (data) => {
      subprocess.stdin.write(data);
      subprocess.stdin.flush();
    },
    resize: (c, r) => {
      cols = c;
      rows = r;
    },
    kill: () => {
      subprocess.stdin.end();
      subprocess.kill();
    },
  };
};

let ptyProcess = null;

export default async (message, server) => {
  if (ptyProcess === null) {
    ptyProcess = spawn([], {
      name: "xterm-256color",
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });
    ptyProcess.onData((data) => {
      if (data)
        server.publish(
          "slidesk",
          JSON.stringify({
            data,
            action: "xterm_response",
          }),
        );
    });
  }
  ptyProcess.write(JSON.parse(message).data);
};
