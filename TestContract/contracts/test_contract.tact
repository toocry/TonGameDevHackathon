import "@stdlib/deploy";

message NewPlayerScore {

    playerAddress: Address;
    score: Int as uint32;
}

// message SetValue {
//     value: Int as uint32;
// }

contract Game with Deployable {
    owner: Address;
    playersMap: map<Address, Int>;
    // player: Address;
    score: Int as uint32 = 0;


    init() {    
        self.owner = sender();
        self.player = newAddress(0, 0);
        self.leaderboard.set(self.owner, self.score);
    }


    receive(msg: NewPlayerScore) {
        self.leaderboard.set(msg.playerAddress, msg.score);
    }

    receive("increment") {
        self.score = self.score + 1;
        self.leaderboard.set(self.owner, self.score);
    }

    get fun playerScore(playerAddress: Address): Int? {
        return self.leaderboard.get(playerAddress);
    }

    get fun owner(): Address {
        return self.owner;
    }

    get fun score(): Int {
        return self.score;
    }
}
    