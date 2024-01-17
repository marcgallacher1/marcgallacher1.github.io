import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class LetterCryptogram {

    public char[][] cryptogramAlphabet = new char[26][2];
    File phrasesFile = new File("phrases.txt");
    public String phrase;

    public void Cryptogram(String filename) {



    }

    public void Cryptogram() throws FileNotFoundException {
        Scanner scanFile = new Scanner(phrasesFile);
        ArrayList<String> phrases = new ArrayList<>();
        while (scanFile.hasNext()) {
            phrases.add(scanFile.nextLine());
        }
        Random ran = new Random();
        phrase = phrases.get(ran.nextInt(phrases.size()));
        ArrayList<Character> randomChars = new ArrayList<>();
        Random ranNum = new Random();
        for (int i = 0; i < 26; i++) {
            int random = ranNum.nextInt(26);
            while (true) {
                if (!randomChars.contains((char) ('A' + random + 1)) && ((char) (random + 65) != (char) ('A' + i))) {
                    randomChars.add((char) ('A' + random + 1));
                    break;
                } else {
                    random = ranNum.nextInt(26);
                }
            }
            cryptogramAlphabet[i][0] = (char) ('A' + i);
            cryptogramAlphabet[i][1] = (char) (random + 65);
        }
    }


    public void getPlainLetter(char cryptoLetter) {



    }

}
