class VUMeterProcessor extends AudioWorkletProcessor {

  constructor() {
    super();
    this.channelRMS = [];
    this.channelFrequencies = [];
    this.fftSize = 2048;  // Size of FFT, higher values give better frequency resolution
    this.buffer = new Float32Array(this.fftSize);  // Buffer for audio data
  }


  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const numChannels = input.length;

    this.channelRMS = new Array(numChannels);
    this.channelFrequencies = new Array(numChannels);

    for (let channel = 0; channel < numChannels; channel++) {
      const inputChannel = input[channel];

      let sumSquares = 0;
      for (let i = 0; i < inputChannel.length; i++) {
        sumSquares += inputChannel[i] * inputChannel[i];
      }


      this.channelRMS[channel] = Math.sqrt(sumSquares / inputChannel.length);


      const frequencies = this.calculateDFT(inputChannel);
      this.channelFrequencies[channel] = frequencies;


    }

    this.port.postMessage({
      rms: this.channelRMS,
      frequencies: this.channelFrequencies
    });

    return true;
  }

  // Simple DFT to get frequency data
  calculateDFT(channelData) {
    const N = channelData.length;
    const frequencies = new Float32Array(N / 2); // Only need half of the DFT
    const real = new Float32Array(N);
    const imag = new Float32Array(N);

    // Calculate real and imaginary parts
    for (let k = 0; k < N; k++) {
      real[k] = 0;
      imag[k] = 0;
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real[k] += channelData[n] * Math.cos(angle);
        imag[k] -= channelData[n] * Math.sin(angle);
      }
    }

    // Calculate magnitude (frequency spectrum)
    for (let i = 0; i < N / 2; i++) {
      frequencies[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
    }

    return frequencies;
  }

}

registerProcessor('rabitz-processor', VUMeterProcessor);