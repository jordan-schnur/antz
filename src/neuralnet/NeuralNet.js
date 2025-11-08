
export class NeuralNet {
    /** @type {number[]} */
    layers = [];
    /** @type {number[][][]} */
    weights = [];
    /** @type {number[][]} */
    biases = [];

    constructor(layers, clone = false) {
        this.layers = layers;

        if (!clone) {
            this.initializeWeightsAndBiases();
        }
    }

    initializeWeightsAndBiases() {
        for (let l = 1; l < this.layers.length; l++) {
            let inSize = this.layers[l - 1];
            let outSize = this.layers[l];

            let layerWeights = [];
            let layerBiases = [];

            for (let i  = 0; i < outSize; i++) {
                let neuronWeights = [];

                for (let j = 0; j < inSize; j++) {
                    neuronWeights.push(Math.random() * 2 - 1); // Random weights between -1 and 1
                }
                layerWeights.push(neuronWeights);
                layerBiases.push(Math.random() * 2 - 1); // Random bias between -1 and 1
            }

            this.weights.push(layerWeights);
            this.biases.push(layerBiases);
        }
    }

    /** @param {number} x */
    activate(x) {
        return Math.tan(x);
    }


    forward(input) {
        let activations = input;

        for (let l = 0; l < this.weights.length; l++) {
            let nextActivations = [];

            for (let i = 0; i < this.weights[l].length; i++) {
                let sum = this.biases[l][i];

                for (let j = 0; j < this.weights[l][i].length; j++) {
                    sum += this.weights[l][i][j] * activations[j];
                }

                nextActivations.push(this.activate(sum));
            }

            activations = nextActivations;
        }

        return activations;
    }

    /** @returns {NeuralNet} */
    cloneNetwork() {
        const clone = new NeuralNet(this.layers, true);

        clone.weights = [];

        for (let l = 0; l < this.weights.length; l++) {
            let newLayer = [];

            for (let i = 0; i < this.weights[l].length; i++) {
                newLayer.push([...this.weights[l][i]]);
            }
            clone.weights.push(newLayer);
        }

        clone.biases = this.biases.map(layer => [...layer]);
    }

    mutateNetwork(mutationRate = 0.1, mutationAmount = 0.5) {
        for (let l = 0; l < this.weights.length; l++) {
            for (let i = 0; i < this.weights[l].length; i++) {
                for (let j = 0; j < this.weights[l][i].length; j++) {
                    if (Math.random() < mutationRate) {
                        this.weights[l][i][j] += (Math.random() * 2 - 1) * mutationAmount;
                    }
                }

                if (Math.random() < mutationRate) {
                    this.biases[l][i] += (Math.random() * 2 - 1) * mutationAmount;
                }
            }
        }
    }
}