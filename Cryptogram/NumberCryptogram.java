import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class NumberCryptogram {

    public String[][] cryptogramAlphabet = new String[26][2];
    File phrasesFile = new File("phrases.txt");
    public String phrase;

    public void Cryptogram(String filename) throws FileNotFoundException {



    }


    public void Cryptogram() throws FileNotFoundException {
        Scanner scanFile = new Scanner(phrasesFile);
        ArrayList<String> phrases = new ArrayList<>();
        while (scanFile.hasNext()) {
            phrases.add(scanFile.nextLine());
        }
        Random ran = new Random();
        phrase = phrases.get(ran.nextInt(phrases.size()));
        ArrayList<Integer> randomNums = new ArrayList<>();
        Random ranNum = new Random();
        for (int i = 0; i < 26; i++) {
            int random = ranNum.nextInt(26);
            while (true) {
                if (!randomNums.contains(random)) {
                    randomNums.add(random);
                    break;
                } else {
                    random = ranNum.nextInt(26);
                }
            }
            cryptogramAlphabet[i][0] = String.valueOf((char) ('A' + i));
            cryptogramAlphabet[i][1] = String.valueOf(random + 1);
        }
    }


    public void getPlainLetter(char cryptoValue) {



    }


}



