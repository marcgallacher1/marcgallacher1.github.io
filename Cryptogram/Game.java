import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;
import java.util.Scanner;
import java.io.IOException;


public class Game {

    public static Cryptogram cryp;
    public static String numOrLet;
    public static String playerName;
    public static Players players;
    public static ArrayList<ArrayList<Object>> playerGame = new ArrayList<>();
    public static int cryptogramsPlayed = 0;
    public static int correct_cryptogram = 0;
    public static int cryptogramsCompleted = 0;
    public static int total_guesses = 0;
    public static int countAssignments = 0;
    public static ArrayList<ArrayList<Object>> playerStats = new ArrayList<>();
    public static boolean playOrLoad = false;
    public static ArrayList<ArrayList<Object>> frequencies = new ArrayList<>();
    public static ArrayList<ArrayList<Object>> scoreList = new ArrayList<>();


    static {
        try {
            players = new Players();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) throws IOException {

        System.out.println("Enter username:");
        Scanner scanUsername = new Scanner(System.in);
        playerName = scanUsername.next();
        playerName = playerName.toUpperCase();
        getUsername(playerName);
        countAssignments = 0;
        Scanner scanUser = new Scanner(System.in);
        String input = "";

        loadPlayerGame(playerGame);
        loadPlayerStats(playerStats);

        game:
        while (true) {
            System.out.println("\nDo you want to play a game, load your most recent game,view player scores, or view your statistics? Enter 'play', 'load', 'scores' or 'stats':");
            input = scanUser.next();

            while (!input.equals("play") && !input.equals("load") && !input.equals("stats") && !input.equals("scores")) {
                System.out.println("\nPlease enter a valid command...");
                input = scanUser.next();
            }

            if (input.equals("load")) {
                loadGame(playerName);
                if (!playOrLoad) {
                    continue game;
                } else {
                    findFrequencies();
                    cryp.printCryp(numOrLet);
                }
            } else if (input.equals("play")) {
                System.out.println("\nWould you like to play a letter or number cryptogram? Enter 'number' or 'letter':");
                numOrLet = scanUser.next();
                while (!numOrLet.equals("number") && !numOrLet.equals("letter")) {
                    System.out.println("\nPlease enter either 'number' or 'letter':");
                    numOrLet = scanUser.next();
                }
                cryp = new Cryptogram(numOrLet);
                findFrequencies();
                cryp.printCryp(numOrLet);
            } else if (input.equals("scores")) {

                sortScores(createScoreList(playerStats));

            } else {
                for (int i = 0; i < playerStats.size(); i++) {
                    if (playerStats.get(i).get(0).equals(playerName)) {
                        System.out.println("Player Name: " + playerStats.get(i).get(0));
                        System.out.println("Correct Guesses: " + playerStats.get(i).get(4));
                        System.out.println("Cryptograms Played: " + playerStats.get(i).get(2));
                        System.out.println("Cryptograms Completed: " + playerStats.get(i).get(3));
                        System.out.println("Accuracy: " + Math.round((float) ((Integer) playerStats.get(i).get(4)) / (Integer) playerStats.get(i).get(1)) * 100 + "%");
                    }
                }
            }

            while (true) {
                System.out.println("\n\nType 'enter' to enter a number/letter to decrypt, 'undo' to remove a letter already assigned, 'save' to save your progress, 'submit' to submit your answer, 'solution' if you want to see the answer, 'hint' for a hint, or 'exit':");
                input = scanUser.next();
                switch (input) {
                    case "enter":
                        System.out.println("\nEnter the number/letter you wish to switch:");
                        String decrypted = scanUser.next();
                        System.out.println("\nEnter the letter you wish to switch " + decrypted + " to?:");
                        String guess = scanUser.next();
                        guess = guess.toUpperCase();
                        assign(decrypted, guess);
                        cryp.printCryp(numOrLet);
                        break;
                    case "undo":
                        if (countAssignments == 0) {
                            System.out.println("\nAnswer is empty, cannot undo...\n");
                            cryp.printCryp(numOrLet);
                            break;
                        }
                        System.out.println("\nEnter letter to undo:");
                        String undo = scanUser.next();
                        undoLetter(undo);
                        cryp.printCryp(numOrLet);
                        break;
                    case "save":

                        incompleteUpdate();
                        saveGame();

                        break;
                    case "submit":

                        submitGame();

                        break;


                    case "solution":

                        showSolution();

                        break;

                    case "hint":

                        getHint();
                        cryp.printCryp(numOrLet);
                        break;

                    case "exit":
                        while (true) {
                            scanUser.nextLine();
                            System.out.println("\nWould you like to save the game before exiting? (yes / no):\n");
                            input = scanUser.nextLine().toLowerCase();

                            if (input.equals("yes") || input.equals("no")) {
                                switch (input) {
                                    case "yes":
                                        saveGame();
                                    case "no":
                                        continue game;
                                }
                                break;
                            } else {
                                System.out.println("Invalid input. Please try again.");
                            }
                        }

                    default:
                        System.out.print("\nPlease enter a valid command...");
                        break;
                }
            }
        }

    }

    public static String showSolution() {
        System.out.println("\n" + cryp.getPhrase() + "\n");
        cryp.printCryp(numOrLet);

        return cryp.getPhrase();
    }

    public static void getHint() {
        Random ran = new Random();
        ArrayList<Integer> indexesOfChars = new ArrayList<>();
        boolean hintGiven = false;

        for (int i = 0; i < cryp.getPhrase().length(); i++) {
            if (!(cryp.getPhrase().charAt(i) == ' ' || cryp.getPhrase().charAt(i) == '\'' || cryp.getPhrase().charAt(i) == '.')) {
                indexesOfChars.add(i);
            }
        }

        for (int i = 0; i < cryp.getPhrase().length(); i++) {
            if (cryp.answer[i] != '_' && cryp.answer[i] == cryp.getPhrase().charAt(i)) {
                indexesOfChars.remove(Integer.valueOf(i));
            }
        }

        while (!hintGiven) {
            if (indexesOfChars.isEmpty()) {
                System.out.println("\nYou have no more remaining hints...\n");
                return;
            }

            int randomChar = indexesOfChars.get(ran.nextInt(indexesOfChars.size()));

            if (cryp.answer[randomChar] == cryp.getPhrase().charAt(randomChar)) {
                indexesOfChars.remove(Integer.valueOf(randomChar));
                continue;
            }

            if (numOrLet.equals("number")) {
                for (int i = 0; i < cryp.cryptogramAlphabetNumber.length; i++) {
                    if (cryp.cryptogramAlphabetNumber[i][0].charAt(0) == cryp.getPhrase().charAt(randomChar)) {
                        if (cryp.answer[randomChar] != '_') {
                            undoLetter(Character.toString(cryp.answer[randomChar]));
                        }
                        assign(cryp.cryptogramAlphabetNumber[i][1], Character.toString(cryp.getPhrase().charAt(randomChar)));
                        hintGiven = true;
                        break;
                    }
                }
            } else {
                for (int i = 0; i < cryp.cryptogramAlphabetLetter.length; i++) {
                    if (cryp.cryptogramAlphabetLetter[i][0] == cryp.getPhrase().charAt(randomChar)) {
                        if (cryp.answer[randomChar] != '_') {
                            undoLetter(Character.toString(cryp.answer[randomChar]));
                        }
                        assign(Character.toString(cryp.cryptogramAlphabetLetter[i][1]), Character.toString(cryp.getPhrase().charAt(randomChar)));
                        hintGiven = true;
                        break;
                    }
                }
            }
        }
    }

    public static void submitGame() throws IOException {
        if (checkSubmission()) {
            correctUpdate();
        } else {
            incorrectUpdate();
        }
    }

    public static void assign(String decrypted, String guess) {

        boolean isAssigned = false;
        if (numOrLet.equals("number")) {
            String[][] cryptogramAlphabet = cryp.cryptogramAlphabetNumber;
            for (int i = 0; i < cryptogramAlphabet.length; i++) {
                if (cryptogramAlphabet[i][1].equals(decrypted)) {
                    boolean correctBefore = false;
                    for (int j = 0; j < cryp.getPhrase().length(); j++) {
                        if (cryptogramAlphabet[i][0].charAt(0) == cryp.getPhrase().charAt(j)) {
                            if (cryp.answer[j] != '_') {
                                System.out.println("\n" + cryp.answer[j] + " is already assigned to " + decrypted + "...\n");
                                isAssigned = true;

                                break;
                            }
                            countAssignments++;
                            cryp.answer[j] = guess.charAt(0);
                            isAssigned = true;

                            if (guess.charAt(0) == cryptogramAlphabet[i][0].charAt(0)) {
                                if (!correctBefore) {
                                    correct_cryptogram++;
                                    correctBefore = true;
                                }
                            }

                        }
                    }
                }
            }
            if (!isAssigned) {
                System.out.println("\n" + decrypted + " not found...\n");
            } else {
                total_guesses++;
            }
        } else {
            decrypted = decrypted.toUpperCase();
            char[][] cryptogramAlphabet = cryp.cryptogramAlphabetLetter;
            for (int i = 0; i < cryptogramAlphabet.length; i++) {
                if (cryptogramAlphabet[i][1] == decrypted.charAt(0)) {
                    boolean correctBefore = false;
                    for (int j = 0; j < cryp.getPhrase().length(); j++) {
                        if (cryptogramAlphabet[i][0] == cryp.getPhrase().charAt(j)) {
                            if (cryp.answer[j] != '_') {
                                System.out.println("\n" + cryp.answer[j] + " is already assigned to " + decrypted + "...\n");
                                isAssigned = true;
                                break;
                            }
                            countAssignments++;
                            cryp.answer[j] = guess.charAt(0);
                            isAssigned = true;


                            if (guess.charAt(0) == cryptogramAlphabet[i][0]) {
                                if (!correctBefore) {
                                    correct_cryptogram++;
                                    correctBefore = true;
                                }
                            }

                        }
                    }
                }
            }

            if (!isAssigned) {
                System.out.println("\n" + decrypted + " not found...\n");
            } else {
                total_guesses++;
            }
        }
    }

    public static void undoLetter(String undo) {
        boolean ifUndone = false;
        for (int i = 0; i < cryp.answer.length; i++) {
            if (cryp.answer[i] == undo.toUpperCase().charAt(0)) {
                cryp.answer[i] = '_';
                countAssignments--;
                ifUndone = true;
            }
        }
        if (!ifUndone) {
            System.out.println("\n" + undo.toUpperCase() + " not found, cannot undo a letter that has not been entered...\n");
        }
    }

    public static void getUsername(String username) {

        String filename = "players.txt";

        Player newP = new Player(username, 0, 0, 0, 0);
        if (Players.addPlayer(newP)) {

            try {
                FileWriter writer = new FileWriter(filename, true);
                writer.write(username + " 0 0 0 0\n");
                writer.close();
            } catch (IOException e) {
                System.out.println("An error occurred.");
                e.printStackTrace();
            }

            System.out.println("Welcome to the game " + username);

        } else {

            System.out.println("Welcome back " + username);

        }


    }


    public static void saveGame() {
        try {
            FileWriter out = new FileWriter("playerCryp.txt", false);
            boolean gameUpdated = false;

            if (playerGame.size() == 0) {
                if (numOrLet.equals("letter")) {
                    playerGame.add(new ArrayList<>(Arrays.asList(playerName, Arrays.deepToString(cryp.cryptogramAlphabetLetter), Arrays.toString(cryp.answer), countAssignments, numOrLet, cryp.getPhrase())));
                } else if (numOrLet.equals("number")) {
                    playerGame.add(new ArrayList<>(Arrays.asList(playerName, Arrays.deepToString(cryp.cryptogramAlphabetNumber), Arrays.toString(cryp.answer), countAssignments, numOrLet, cryp.getPhrase())));
                }
                for (int i = 0; i < playerGame.size(); i++) {
                    for (int j = 0; j < 6; j++) {
                        out.write(playerGame.get(i).get(j) + "\n");
                    }
                }
            } else {
                for (int i = 0; i < playerGame.size(); i++) {
                    if (playerGame.get(i).get(0).equals(playerName)) {
                        if (numOrLet.equals("letter")) {
                            playerGame.get(i).set(1, Arrays.deepToString(cryp.cryptogramAlphabetLetter));
                        } else if (numOrLet.equals("number")) {
                            playerGame.get(i).set(1, Arrays.deepToString(cryp.cryptogramAlphabetNumber));
                        }
                        playerGame.get(i).set(2, Arrays.toString(cryp.answer));
                        playerGame.get(i).set(3, countAssignments);
                        playerGame.get(i).set(4, numOrLet);
                        playerGame.get(i).set(5, cryp.getPhrase());
                        gameUpdated = true;
                        break;
                    }
                }
                if (!gameUpdated) {
                    if (numOrLet.equals("letter")) {
                        playerGame.add(new ArrayList<>(Arrays.asList(playerName, Arrays.deepToString(cryp.cryptogramAlphabetLetter), Arrays.toString(cryp.answer), countAssignments, numOrLet, cryp.getPhrase())));
                    } else if (numOrLet.equals("number")) {
                        playerGame.add(new ArrayList<>(Arrays.asList(playerName, Arrays.deepToString(cryp.cryptogramAlphabetNumber), Arrays.toString(cryp.answer), countAssignments, numOrLet, cryp.getPhrase())));
                    }
                }
                for (int i = 0; i < playerGame.size(); i++) {
                    for (int j = 0; j < 6; j++) {
                        out.write(playerGame.get(i).get(j) + "\n");
                    }
                }
            }
            out.close();
            System.out.println("Game saved");


        } catch (IOException e) {
            System.err.println("Failed to save game");
        }
    }

    public static int averageScore(int correct_cryptogram, int total_guesses) {
        return ((correct_cryptogram / total_guesses) * 100);
    }

    public static void loadGame(String playerName) throws FileNotFoundException {
        boolean printed = false;
        String arrayContent = "";
        String[] strArr = {};
        for (int i = 0; i < playerGame.size(); i++) {
            if (playerGame.get(i).get(0).equals(playerName)) {
                if (playerGame.get(i).get(4).equals("number")) {
                    String[] splitAlpha = playerGame.get(i).get(1).toString().substring(2, playerGame.get(i).get(1).toString().length() - 2).split("\\], \\[");
                    cryp = new Cryptogram(playerGame.get(i).get(4).toString() + "load");
                    cryp.cryptogramAlphabetNumber = new String[26][2];

                    for (int j = 0; j < splitAlpha.length; j++) {
                        String[] pair = splitAlpha[j].split(", ");
                        cryp.cryptogramAlphabetNumber[j][0] = pair[0];
                        cryp.cryptogramAlphabetNumber[j][1] = pair[1];
                    }

                    int startIndex = playerGame.get(i).get(2).toString().indexOf('[');
                    int endIndex = playerGame.get(i).get(2).toString().lastIndexOf(']');

                    arrayContent = playerGame.get(i).get(2).toString().substring(startIndex + 1, endIndex).trim();
                    strArr = arrayContent.split(",\\s?");

                    for (int j = 0; j < strArr.length; j++) {
                        if (strArr[j].isEmpty()) {
                            cryp.answer[j] = ' ';
                        } else {
                            cryp.answer[j] = strArr[j].charAt(0);
                        }
                    }

                    countAssignments = Integer.parseInt(playerGame.get(i).get(3).toString());
                    numOrLet = playerGame.get(i).get(4).toString();
                    cryp.setPhrase(playerGame.get(i).get(5).toString());
                    printed = true;
                    playOrLoad = true;
                } else {
                    String[] splitAlpha = playerGame.get(i).get(1).toString().substring(2, playerGame.get(i).get(1).toString().length() - 2).split("\\], \\[");
                    String[] splitAns = playerGame.get(i).get(2).toString().substring(1, playerGame.get(i).get(2).toString().length() - 1).split(",");
                    cryp = new Cryptogram(playerGame.get(i).get(4).toString() + "load");
                    cryp.cryptogramAlphabetLetter = new char[26][2];

                    for (int j = 0; j < splitAlpha.length; j++) {
                        String[] pair = splitAlpha[j].split(", ");
                        cryp.cryptogramAlphabetLetter[j][0] = pair[0].charAt(0);
                        cryp.cryptogramAlphabetLetter[j][1] = pair[1].charAt(0);
                    }

                    int startIndex = playerGame.get(i).get(2).toString().indexOf('[');
                    int endIndex = playerGame.get(i).get(2).toString().lastIndexOf(']');

                    arrayContent = playerGame.get(i).get(2).toString().substring(startIndex + 1, endIndex).trim();
                    strArr = arrayContent.split(",\\s?");

                    for (int j = 0; j < strArr.length; j++) {
                        if (strArr[j].isEmpty()) {
                            cryp.answer[j] = ' ';
                        } else {
                            cryp.answer[j] = strArr[j].charAt(0);
                        }
                    }

                    countAssignments = Integer.parseInt(playerGame.get(i).get(3).toString());
                    numOrLet = playerGame.get(i).get(4).toString();
                    cryp.setPhrase(playerGame.get(i).get(5).toString());
                    printed = true;
                    playOrLoad = true;
                }
            }
        }
        if (!printed) {
            System.out.println("\nYou do not have a game saved under that name...\n");
            playOrLoad = false;
        }
    }

    public static void loadPlayerStats(ArrayList<ArrayList<Object>> playerStats) throws FileNotFoundException {

        File playerStatsFile = new File("players.txt");
        Scanner scanPlayerStats = new Scanner(playerStatsFile);

        while (scanPlayerStats.hasNext()) {

            String pName = scanPlayerStats.next();
            int TG = scanPlayerStats.nextInt();
            int CP = scanPlayerStats.nextInt();
            int CC = scanPlayerStats.nextInt();
            int CG = scanPlayerStats.nextInt();

            playerStats.add(new ArrayList<>(Arrays.asList(pName, TG, CP, CC, CG)));

        }
    }

    public static void loadPlayerGame(ArrayList<ArrayList<Object>> playerGame) throws FileNotFoundException {
        File playerGameFile = new File("playerCryp.txt");
        Scanner scanPlayerGame = new Scanner(playerGameFile);
        String arrayContent = "";
        String[] strArr = {};

        while (scanPlayerGame.hasNext()) {
            String name = scanPlayerGame.nextLine();
            String alphabet = scanPlayerGame.nextLine();
            String answer = scanPlayerGame.nextLine();
            int countAss = Integer.parseInt(scanPlayerGame.nextLine());
            String numOrLet = scanPlayerGame.nextLine();
            String phrase = scanPlayerGame.nextLine();

            String[] splitAlpha = alphabet.substring(2, alphabet.length() - 2).split("\\], \\[");
            String[] splitAns = answer.substring(1, answer.length() - 1).split(",");
            if (numOrLet.equals("number")) {
                cryp = new Cryptogram(numOrLet + "temp");
                cryp.cryptogramAlphabetNumber = new String[26][2];

                for (int i = 0; i < splitAlpha.length; i++) {
                    String[] pair = splitAlpha[i].split(", ");
                    cryp.cryptogramAlphabetNumber[i][0] = pair[0];
                    cryp.cryptogramAlphabetNumber[i][1] = pair[1];
                }

                int startIndex = answer.indexOf('[');
                int endIndex = answer.lastIndexOf(']');

                arrayContent = answer.substring(startIndex + 1, endIndex).trim();
                strArr = arrayContent.split(",\\s?");

                for (int j = 0; j < strArr.length; j++) {
                    if (strArr[j].isEmpty()) {
                        cryp.answer[j] = ' ';
                    } else {
                        cryp.answer[j] = strArr[j].charAt(0);
                    }
                }

                playerGame.add(new ArrayList<>(Arrays.asList(name, Arrays.deepToString(cryp.cryptogramAlphabetNumber), Arrays.toString(cryp.answer), countAss, numOrLet, phrase)));
            } else {
                cryp = new Cryptogram(numOrLet + "temp");
                cryp.cryptogramAlphabetLetter = new char[26][2];

                for (int i = 0; i < splitAlpha.length; i++) {
                    String[] pair = splitAlpha[i].split(", ");
                    cryp.cryptogramAlphabetLetter[i][0] = pair[0].charAt(0);
                    cryp.cryptogramAlphabetLetter[i][1] = pair[1].charAt(0);
                }

                int startIndex = answer.indexOf('[');
                int endIndex = answer.lastIndexOf(']');

                arrayContent = answer.substring(startIndex + 1, endIndex).trim();
                strArr = arrayContent.split(",\\s?");

                for (int j = 0; j < strArr.length; j++) {
                    if (strArr[j].isEmpty()) {
                        cryp.answer[j] = ' ';
                    } else {
                        cryp.answer[j] = strArr[j].charAt(0);
                    }
                }

                playerGame.add(new ArrayList<>(Arrays.asList(name, Arrays.deepToString(cryp.cryptogramAlphabetLetter), Arrays.toString(cryp.answer), countAss, numOrLet, phrase)));
            }
        }
    }

    public static boolean checkSubmission() {
        System.out.println("phrase = " + cryp.phrase);
        System.out.println("Answer = " + Arrays.toString(cryp.answer));
        boolean correct = true;

        for (int i = 0; i < cryp.getPhrase().length(); i++) {

            if (cryp.answer[i] != cryp.getPhrase().charAt(i) && cryp.getPhrase().charAt(i) != '.') {
                correct = false;
                System.out.println("Your answer is false");
                break;
            }

        }

        return correct;
    }

    public void setPlayerName(String playerName) {
        Game.playerName = playerName;
    }

    public void setCryptogramsAlphabetLetter(char[][] crypLet) {
        Game.cryp.cryptogramAlphabetLetter = crypLet;
    }

    public void setCryptogramsAlphabetNumber(String[][] crypNum) {
        Game.cryp.cryptogramAlphabetNumber = crypNum;
    }

    public void setAnswer(char[] ans) {
        Game.cryp.answer = ans;
    }

    public void setNumAss(int numAss) {
        Game.countAssignments = numAss;
    }

    public void setNumOrLet(String numOrLet) {
        Game.numOrLet = numOrLet;
    }

    public void setPhrase(String phrase) {
        Game.cryp.setPhrase(phrase);
    }

    public void setCryp(Cryptogram cryp) {
        Game.cryp = cryp;
    }

    public static void correctUpdate() throws IOException {

        System.out.println("You are correct!");
        cryptogramsPlayed++;
        cryptogramsCompleted++;

        File playersFile = new File("players.txt");
        Scanner scanner = new Scanner(playersFile);
        FileWriter out = new FileWriter("players.txt", false);

        while (scanner.hasNext()) {
            playerStats.add(new ArrayList<>(Arrays.asList(scanner.next(), scanner.nextInt(), scanner.nextInt(), scanner.nextInt())));
        }

        for (int i = 0; i < playerStats.size(); i++) {

            if (playerStats.get(i).get(0).equals(playerName)) {
                int newTG = total_guesses;
                int newCP = Integer.parseInt(playerStats.get(i).get(2).toString()) + cryptogramsPlayed;
                int newCC = Integer.parseInt(playerStats.get(i).get(2).toString()) + cryptogramsCompleted;
                int newCG = correct_cryptogram;

                playerStats.get(i).set(1, newTG);
                playerStats.get(i).set(2, newCP);
                playerStats.get(i).set(3, newCC);
                playerStats.get(i).set(4, newCG);

            }


            for (int k = 0; k < 5; k++) {
                out.write(playerStats.get(i).get(k) + " ");
            }
            out.write("\n");
        }
        out.close();

    }


    public static void incorrectUpdate() throws IOException {

        System.out.println("You are incorrect!");
        cryptogramsPlayed++;

        File playersFile = new File("players.txt");
        Scanner scanner = new Scanner(playersFile);
        FileWriter out = new FileWriter("players.txt", false);

        while (scanner.hasNext()) {
            playerStats.add(new ArrayList<>(Arrays.asList(scanner.next(), scanner.nextInt(), scanner.nextInt())));
        }

        for (int i = 0; i < playerStats.size(); i++) {

            if (playerStats.get(i).get(0).equals(playerName)) {
                int newTG = total_guesses;
                int newCP = Integer.parseInt(playerStats.get(i).get(2).toString()) + cryptogramsPlayed;
                int sameCC = Integer.parseInt(playerStats.get(i).get(3).toString());
                int newCG = correct_cryptogram;

                playerStats.get(i).set(1, newTG);
                playerStats.get(i).set(2, newCP);
                playerStats.get(i).set(3, sameCC);
                playerStats.get(i).set(4, newCG);

            }

            for (int k = 0; k < 5; k++) {
                out.write(playerStats.get(i).get(k) + " ");
            }
            out.write("\n");

        }
        out.close();

    }

    public static void incompleteUpdate() throws IOException {

        File playersFile = new File("players.txt");
        Scanner scanner = new Scanner(playersFile);
        FileWriter out = new FileWriter("players.txt", false);

        while (scanner.hasNext()) {
            playerStats.add(new ArrayList<>(Arrays.asList(scanner.next(), scanner.nextInt(), scanner.nextInt())));
        }

        for (int i = 0; i < playerStats.size(); i++) {

            if (playerStats.get(i).get(0).equals(playerName)) {
                int newTG = total_guesses;
                int sameCP = Integer.parseInt(playerStats.get(i).get(2).toString());
                int sameCC = Integer.parseInt(playerStats.get(i).get(3).toString());
                int newCG = Integer.parseInt(playerStats.get(i).get(4).toString());

                playerStats.get(i).set(1, newTG);
                playerStats.get(i).set(2, sameCP);
                playerStats.get(i).set(3, sameCC);
                playerStats.get(i).set(4, newCG);

            }

            for (int k = 0; k < 5; k++) {
                out.write(playerStats.get(i).get(k) + " ");
            }
            out.write("\n");

        }
        out.close();


    }

    public static void findFrequencies() {

        frequencies.clear();

        String phrase = cryp.getPhrase();
        ArrayList<Character> charArr = new ArrayList<>();
        char phraseChar = 0;

        for (int i = 0; i < phrase.length(); i++) {
            phraseChar = phrase.charAt(i);
            if (phraseChar == ' ' || phraseChar == '\'' || phraseChar == '.' || phraseChar == ',') {
                continue;
            }
            if (!charArr.contains(phraseChar)) {
                charArr.add(phraseChar);
            }
        }

        for (int i = 0; i < charArr.size(); i++) {
            ArrayList<Object> temppopulate = new ArrayList<>();
            temppopulate.add(charArr.get(i));
            temppopulate.add(0);
            frequencies.add(temppopulate);
        }

        for (int i = 0; i < phrase.length(); i++) {
            for (int j = 0; j < frequencies.size(); j++) {
                if (phrase.charAt(i) == (Character)frequencies.get(j).get(0)) {
                    frequencies.get(j).set(1, ((Integer)frequencies.get(j).get(1) + 1));
                }
            }
        }
    }



    public static ArrayList<ArrayList<Object>> createScoreList(ArrayList<ArrayList<Object>> playerStats) {

        for (int i = 0; i < playerStats.size(); i++) {
            ArrayList<Object> tempArr = new ArrayList<>();

            tempArr.add(playerStats.get(i).get(0));
            tempArr.add(playerStats.get(i).get(3));
            scoreList.add(tempArr);
        }

        return scoreList;

    }

    public static void sortScores(ArrayList<ArrayList<Object>> scoreList) {

        int n = scoreList.size();

        for (int i = 0; i < n; i++) {
            if (scoreList.get(i) == null) {
                continue;
            }
            int currentScore = (Integer) scoreList.get(i).get(1);
            String currentName = scoreList.get(i).get(0).toString();

            int j = i - 1;
            while (j >= 0 && (scoreList.get(j) == null || (Integer) scoreList.get(j).get(1) < currentScore)) {
                if (scoreList.get(j) != null) {
                    scoreList.get(j + 1).set(0, scoreList.get(j).get(0));
                    scoreList.get(j + 1).set(1, scoreList.get(j).get(1));
                }
                j--;
            }

            scoreList.get(j + 1).set(0, currentName);
            scoreList.get(j + 1).set(1, currentScore);
        }

        System.out.println("RANK PLAYER_NAME CRYPTOGRAMS_COMPLETED");
        for (int times = 0; times < 10; times++) {

            if (times >= scoreList.size() || scoreList.get(times) == null || scoreList.get(times).get(0) == null) {

                System.out.println(times + 1 + ". N/A : N/A");

            } else {

                System.out.println(times + 1 + ". " + scoreList.get(times).get(0) + " : " + scoreList.get(times).get(1));

            }
        }
    }
}







