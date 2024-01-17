import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class JUnitTests {

    String playerName;
    char[][] cryptogramAlphabetLetter;
    char[] answer;
    int numAss;
    String numOrLet;
    String phrase;
    Cryptogram cryp;
    Game game;
    ByteArrayOutputStream outContent = new ByteArrayOutputStream();

    @Before
    public void setUp() throws FileNotFoundException {
        playerName = "Chris";
        cryptogramAlphabetLetter = new char[][]{{'A', 'L'}, {'B', 'N'}, {'C', 'B'}, {'D', 'H'}, {'E', 'O'}, {'F', 'W'}, {'G', 'T'}, {'H', 'U'}, {'I', 'A'}, {'J', 'S'}, {'K', 'C'}, {'L', 'D'}, {'M', 'K'}, {'N', 'Z'}, {'O', 'G'}, {'P', 'J'}, {'Q', 'E'}, {'R', 'P'}, {'S', 'F'}, {'T', 'M'}, {'U', 'V'}, {'V', 'I'}, {'W', 'R'}, {'X', 'Y'}, {'Y', 'Q'}, {'Z', 'X'}};
        answer = new char[]{'_', '_', ' ', '_', '_', ' ', '_', '_', ' ', '_', '_', '_', ' ', '_', '_', ' ', '_', '_', ' ', '_', '_', '_', '_', ' ', '_', '_', ' ', '_', '_', '_', ' ', '_', '_', '_', '_', '_', '_', '_', '_', ' ', '\0', '\0', '\0', '\0', '\0', '\0', '\0', '\0', '\0', '\0'};
        numAss = 0;
        numOrLet = "letter";
        phrase = "TO BE OR NOT TO BE THAT IS THE QUESTION.";
        cryp = new Cryptogram(numOrLet + "temp");
        game = new Game();

        game.setCryp(cryp);
        game.setPlayerName(playerName);
        game.setCryptogramsAlphabetLetter(cryptogramAlphabetLetter);
        game.setAnswer(answer);
        game.setNumAss(numAss);
        game.setNumOrLet(numOrLet);
        game.setPhrase(phrase);
    }

    @Before
    public void setUpStreams() {
        System.setOut(new PrintStream(outContent));
    }

    @Test
    public void testSolution() {
        String phraseSol = Game.showSolution();
        assertEquals(phraseSol, phrase);
    }

    @Test
    public void testFrequencies() {
        Game.findFrequencies();

        ArrayList<ArrayList<Object>> tempFreq = new ArrayList<>();
        ArrayList<Character> charArr = new ArrayList<>();
        char phraseChar = 0;

        for (int i = 0; i < phrase.length(); i++) {
            phraseChar = phrase.charAt(i);
            if (phraseChar == ' ' || phraseChar == '\'' || phraseChar == '.' || phraseChar == ',') {
                continue;
            }
            if (!charArr.contains(phraseChar)) {
                charArr.add(phraseChar);
                tempFreq.add(new ArrayList<>(Arrays.asList(phraseChar, 0)));
            }
        }

        for (int i = 0; i < phrase.length(); i++) {
            for (int j = 0; j < tempFreq.size(); j++) {
                if (phrase.charAt(i) == (Character)tempFreq.get(j).get(0)) {
                    tempFreq.get(j).set(1, (Integer)tempFreq.get(j).get(1) + 1);
                }
            }
        }

        for (int i = 0; i < tempFreq.size(); i++) {
            assertEquals(tempFreq.get(i).get(1), Game.frequencies.get(i).get(1));
        }
    }

    @Test
    public void testScores() {

        ArrayList<ArrayList<Object>> expectedSortedScores = new ArrayList<>();

        expectedSortedScores.add(new ArrayList<>(Arrays.asList("Chris", 5)));
        expectedSortedScores.add(new ArrayList<>(Arrays.asList("Marc", 3)));
        expectedSortedScores.add(new ArrayList<>(Arrays.asList("James", 3)));
        expectedSortedScores.add(new ArrayList<>(Arrays.asList("Dario", 2)));
        expectedSortedScores.add(new ArrayList<>(Arrays.asList("Dom", 0)));

        Game.playerStats.add(new ArrayList<>(Arrays.asList("Dom", 0, 0, 0, 0)));
        Game.playerStats.add(new ArrayList<>(Arrays.asList("Chris", 0, 0, 5, 0)));
        Game.playerStats.add(new ArrayList<>(Arrays.asList("Marc", 0, 0, 3, 0)));
        Game.playerStats.add(new ArrayList<>(Arrays.asList("James", 0, 0, 3, 0)));
        Game.playerStats.add(new ArrayList<>(Arrays.asList("Dario", 0, 0, 2, 0)));

        Game.sortScores(Game.createScoreList(Game.playerStats));

        for (int i = 0; i < Game.scoreList.size(); i++) {
            assertEquals(Game.scoreList.get(i), expectedSortedScores.get(i));
        }

    }

    @Test
    public void testHint() {

        while (!outContent.toString().contains("You have no more remaining hints...")) {
            Game.getHint();
        }

        answer = Game.cryp.answer;

        for (int i = 0; i < phrase.length(); i++) {
            if (answer[i] != ' ' && answer[i] != '\'') {
                assertEquals(answer[i], phrase.charAt(i));
            }
        }

    }

}



