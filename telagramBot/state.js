// TODO: use Redis for state management

class TelegramBotStateManager {
    constructor() {
        this.state = new Map();
    }

    setState(telegramId, state) {
        this.state.set(telegramId, state);
    }

    clearState(telegramId) {
        this.state.delete(telegramId);
    }

    getState(telegramId) {
        return this.state.get(telegramId);
    }
}

module.exports = new TelegramBotStateManager();
