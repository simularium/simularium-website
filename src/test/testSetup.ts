// to be loaded by jest config's setupFiles
import { TextDecoder, TextEncoder } from "util";
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
(global as any).TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
