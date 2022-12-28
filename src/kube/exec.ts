// import WebSocket = require('isomorphic-ws');
import querystring from 'querystring'
// import stream = require('stream');

// import { V1Status } from './api';
import { KubeConfig } from './config';
// import { isResizable, ResizableStream, TerminalSizeQueue } from './terminal-size-queue';
import { WebSocketHandler, WebSocketInterface } from './web-socket-handler';

export class Exec {
    public 'handler': WebSocketInterface;

    // private terminalSizeQueue?: TerminalSizeQueue;

    public constructor(config: KubeConfig, wsInterface?: WebSocketInterface) {
        this.handler = wsInterface || new WebSocketHandler(config);
    }

    /**
     * @param {string}  namespace - The namespace of the pod to exec the command inside.
     * @param {string} podName - The name of the pod to exec the command inside.
     * @param {string} containerName - The name of the container in the pod to exec the command inside.
     * @param {(string|string[])} command - The command or command and arguments to execute.
     * @param {stream.Writable} stdout - The stream to write stdout data from the command.
     * @param {stream.Writable} stderr - The stream to write stderr data from the command.
     * @param {stream.Readable} stdin - The stream to write stdin data into the command.
     * @param {boolean} tty - Should the command execute in a TTY enabled session.
     * @param {(V1Status) => void} statusCallback -
     *       A callback to received the status (e.g. exit code) from the command, optional.
     * @return {Promise<WebSocket>} A promise that will return the web socket created for this command.
     */
    public async exec(
        namespace: string,
        podName: string,
        containerName: string,
        command: string | string[],
        stdin: string,
        stdout: (output: string) => void,
        
        tty: boolean,
        statusCallback?: (status: any) => void,
    ): Promise<WebSocket> {
        const query = {
            stdout: true,
            stderr: false,
            stdin: true,
            tty,
            command,
            container: containerName,
        };
        const queryStr = querystring.stringify(query);
        const path = `/api/v1/namespaces/${namespace}/pods/${podName}/exec?${queryStr}`;
        const conn = await this.handler.connect(path, null, (streamNum: number, buff: Buffer): boolean => {
            const status = WebSocketHandler.handleStandardStreams(streamNum, buff, stdout, stdout);
            if (status != null) {
                if (statusCallback) {
                    statusCallback(status);
                }
                return false;
            }
            return true;
        });
        if (stdin != null) {
            WebSocketHandler.handleStandardInput(conn, stdin, WebSocketHandler.StdinStream);
        }
        // if (isResizable(stdout)) {
        //     this.terminalSizeQueue = new TerminalSizeQueue();
        //     WebSocketHandler.handleStandardInput(conn, this.terminalSizeQueue, WebSocketHandler.ResizeStream);
        //     this.terminalSizeQueue.handleResizes(stdout as any as ResizableStream);
        // }
        return conn as any;
    }
}
