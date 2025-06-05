class CommandBase {
    constructor(client, options) {
        Object.defineProperty(this, 'client', { value: client });

        this.name = options.name;

        this.arguments = options.arguments ? options.arguments : undefined;

    }

    run() {
        throw new Error(`Command ${this.name} does not have a run method`);
    }
}

export default CommandBase;