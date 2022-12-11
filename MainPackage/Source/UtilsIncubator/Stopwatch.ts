import { millisecondsToSeconds } from "@yamato-daiwa/es-extensions";


class Stopwatch {

  private activationUnixTimestamp__milliseconds: number = 0;
  private deactivationUnixTimestamp__milliseconds: number = 0;


  public startOrRestart(): this {

    if (this.activationUnixTimestamp__milliseconds === 0) {
      this.activationUnixTimestamp__milliseconds = Date.now();
    }


    return this;
  }

  public stop(): Stopwatch.ElapsedTimeData {

    this.deactivationUnixTimestamp__milliseconds = Date.now();

    const amountOfTimeElapsesBetweenActivationAndDeactivation__milliseconds: number =
        this.deactivationUnixTimestamp__milliseconds - this.activationUnixTimestamp__milliseconds;

    return {
      seconds: millisecondsToSeconds(amountOfTimeElapsesBetweenActivationAndDeactivation__milliseconds),
      milliseconds: amountOfTimeElapsesBetweenActivationAndDeactivation__milliseconds
    };
  }

  public reset(): void {
    this.activationUnixTimestamp__milliseconds = 0;
    this.deactivationUnixTimestamp__milliseconds = 0;
  }

}

namespace Stopwatch {
  export type ElapsedTimeData = Readonly<{
    seconds: number;
    milliseconds: number;
  }>;
}


export default Stopwatch;
