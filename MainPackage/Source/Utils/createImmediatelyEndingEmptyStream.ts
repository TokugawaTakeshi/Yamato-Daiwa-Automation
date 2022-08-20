import { PassThrough as DummyStream } from "stream";


export default function createImmediatelyEndingEmptyStream(): () => NodeJS.ReadWriteStream {
  return (): NodeJS.ReadWriteStream => new DummyStream().end();
}
