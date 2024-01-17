import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class Players {

    private static ArrayList<Player> allPlayers = new ArrayList<>();
    private File players = new File("players.txt");
    Scanner scanPlayers = new Scanner(players);

    public Players() throws FileNotFoundException {
        while (scanPlayers.hasNext()) {
            String user = scanPlayers.next();
            int totalGuesses = scanPlayers.nextInt();
            int cryptogramsPlayed = scanPlayers.nextInt();
            int cryptogramsCompleted = scanPlayers.nextInt();
            int correctGuesses = scanPlayers.nextInt();
            Player newP = new Player(user, totalGuesses, cryptogramsPlayed, cryptogramsCompleted, correctGuesses);
            addPlayer(newP);
        }
    }

    public static boolean addPlayer(Player p) {
        for (Player player : allPlayers) {
            if (player.username.equals(p.username)) {
                return false;
            }
        }
        allPlayers.add(p);
        return true;
    }

    public void savePlayer() {

    }

    public void findPlayer(Player p) {

    }

    public int getAllPlayersAccuracies() {
        return 0;
    }

    public int getAllPlayersCryptogramsPlayed() {
        return 0;
    }

    public int getAllPlayersCompletedCryptos() {
        return 0;
    }

}
