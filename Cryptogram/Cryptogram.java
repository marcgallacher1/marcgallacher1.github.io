import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;

public class Cryptogram {

    public static String phrase;
    public char[] answer = new char[50];
    public String[][] cryptogramAlphabetNumber = new String[26][2];
    public char[][] cryptogramAlphabetLetter = new char[26][2];

    public Cryptogram(String type) throws FileNotFoundException {

        if (type.equals("number")) {
            NumberCryptogram numCryp = new NumberCryptogram();
            numCryp.Cryptogram();
            cryptogramAlphabetNumber = numCryp.cryptogramAlphabet;
            phrase = numCryp.phrase;

        }
        if (type.equals("letter")) {
            LetterCryptogram letCryp = new LetterCryptogram();
            letCryp.Cryptogram();
            cryptogramAlphabetLetter = letCryp.cryptogramAlphabet;
            phrase = letCryp.phrase;
        }
        if (type.equals("numbertemp")) {
            NumberCryptogram numCryp = new NumberCryptogram();
        }
        if (type.equals("lettertemp")) {
            LetterCryptogram letCryp = new LetterCryptogram();
        }
        if (type.equals("numberload")) {
            NumberCryptogram numCryp = new NumberCryptogram();
        }
        if (type.equals("letterload")) {
            LetterCryptogram letCryp = new LetterCryptogram();
        }

    }

    public void getFrequencies() {



    }

    public String getPhrase() {

        return phrase;

    }

    public void setPhrase(String phrase) {

        Cryptogram.phrase = phrase;

    }

    public void printCryp(String numOrLet) {
        if (numOrLet.equals("number")) {

            for (int i = 0; i < phrase.length(); i++) {
                for (int j = 0; j < Game.frequencies.size(); j++) {
                    if (phrase.charAt(i) == (Character)Game.frequencies.get(j).get(0)) {
                        System.out.print(Game.frequencies.get(j).get(1) + " ");
                        break;
                    } else if (phrase.charAt(i) == ' ') {
                        System.out.print("   ");
                        break;
                    } else if (phrase.charAt(i) == '\'') {
                        System.out.print("  ");
                        break;
                    } else if (phrase.charAt(i) == '.') {
                        break;
                    }
                }
            }

            System.out.println("\n");

            boolean prevCharIsSpace = false;
            for (int i = 0; i < phrase.length(); i++) {
                String character = phrase.substring(i, i + 1);
                boolean currentCharIsSpace = (character.equals(" "));
                if (currentCharIsSpace && prevCharIsSpace) {
                    continue;
                }
                for (String[] strings : cryptogramAlphabetNumber) {
                    if (character.equals(" ")) {
                        answer[i] = ' ';
                        System.out.print("   ");
                        break;
                    } else if (character.equals(",")) {
                        answer[i] = ',';
                        System.out.print(", ");
                        break;
                    } else if (character.equals("'")) {
                        answer[i] = '\'';
                        System.out.print("' ");
                        break;
                    } else if (character.equals(".")) {
                        break;
                    } else if (character.equals(strings[0])) {
                        if (answer[i] == '\u0000') {
                            answer[i] = '_';
                        }
                        System.out.print(strings[1] + " ");
                        break;
                    }
                }
                prevCharIsSpace = currentCharIsSpace;
            }
        } else if (numOrLet.equals("letter")) {

            for (int i = 0; i < phrase.length(); i++) {
                for (int j = 0; j < Game.frequencies.size(); j++) {
                    if (phrase.charAt(i) == (Character)Game.frequencies.get(j).get(0)) {
                        System.out.print(Game.frequencies.get(j).get(1) + " ");
                        break;
                    } else if (phrase.charAt(i) == ' ') {
                        System.out.print("   ");
                        break;
                    } else if (phrase.charAt(i) == '\'') {
                        System.out.print("  ");
                        break;
                    } else if (phrase.charAt(i) == '.') {
                        break;
                    }
                }
            }

            System.out.println("\n");

            boolean prevCharIsSpace = false;
            for (int i = 0; i < phrase.length(); i++) {
                char character = phrase.charAt(i);
                boolean currentCharIsSpace = (character == ' ');
                if (currentCharIsSpace && prevCharIsSpace) {
                    continue;
                }
                for (char[] chars : cryptogramAlphabetLetter) {
                    if (character == ' ') {
                        answer[i] = ' ';
                        System.out.print("   ");
                        break;
                    } else if (character == ',') {
                        answer[i] = ',';
                        System.out.print(", ");
                        break;
                    } else if (character == '\'') {
                        answer[i] = '\'';
                        System.out.print("' ");
                        break;
                    } else if (character == '.') {
                        break;
                    } else if (character == chars[0]) {
                        if (answer[i] == '\u0000') {
                            answer[i] = '_';
                        }
                        System.out.print(chars[1] + " ");
                        break;
                    }
                }
                prevCharIsSpace = currentCharIsSpace;
            }
        }
        System.out.println("\n");
        for (char c : answer) {
            if (c == ' ') {
                System.out.print("   ");
            } else if (c == '\u0000') {
                break;
            } else {
                System.out.print(c + " ");
            }
        }
    }


}

