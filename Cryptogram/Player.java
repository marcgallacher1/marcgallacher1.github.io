public class Player {

    public String username;
    public int totalGuesses;
    public int cryptogramsPlayed;
    public int cryptogramsCompleted;

    public int correctGuesses;

    public Player(String username, int totalGuesses, int cryptogramsPlayed, int cryptogramsCompleted, int correctGuesses) {

        this.username = username;
        this.totalGuesses = totalGuesses;
        this.cryptogramsPlayed = cryptogramsPlayed;
        this.cryptogramsCompleted = cryptogramsCompleted;
        this.correctGuesses = correctGuesses;

    }

    public void updateAccuracy() {

    }

    public void incrementCryptogramsCompleted() {
        cryptogramsCompleted++;
    }

    public void incrementCryptogramsPlayed() {
        cryptogramsPlayed++;
    }



    public int getNumCryptogramsCompleted() {
        return cryptogramsCompleted;
    }

    public int getNumCryptogramsPlayed() {
        return cryptogramsPlayed;
    }


}
