import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;

import javax.swing.KeyStroke;

// IMPORTANT: To run this file rename it to "BotClicker.java"
// Otherwise it won't work!!!


public class BotClicker implements Runnable {
	private Robot r;
	private static final int EVT_DELAY = 10;
	private static final int MSG_DELAY = 7000;
	private static final int IMSG_DELAY = 1000;
	public static void main(String[] args) {
		new BotClicker().run();
	}
	
	public BotClicker() {
		try {
			r = new Robot();
		} catch (AWTException e) {
			e.printStackTrace();
		}
	}
	
	public void run() {
		for(int x = 5; x > 0; x--) {
			System.out.println(x + "...");
			delay(1000);
		}
		System.out.println("Starting...");
		int count = 0;
		while(true) {
			writeMainWarning();
			count++;
			if(count%5 == 1)
				writeInstructions();
			delay((int) (MSG_DELAY + Math.random() * MSG_DELAY * 2));
		}
	}
	
	
	
	
	public void writeMainWarning() {
		writeAndEnter("NOTICE This is a FAKE video designed to generate likes and spam an affiliate link."
				+ " Looking at the background (Moon) it's clearly a loop.");
		delay(IMSG_DELAY);
		writeAndEnter("Please DISLIKE and REPORT this video. I already reported it.");
	}
	public void writeInstructions() {
		writeAndEnter("If you're feeling inspired and have a JAVA IDE go do this to their other spam vids."
				+ " I have my source code up at thorlancaster.github.io/ihatespambots.java");
	}
	
	
	
	
	private void writeAndEnter(String s) {
	    for (int i = 0; i < s.length(); i++) {
	        char c = s.charAt(i);
	        boolean uc = Character.isUpperCase(c);
	        if (uc) {
	            r.keyPress(KeyEvent.VK_SHIFT);
	        }
	        if(c == '\'') {
	        	r.keyPress(KeyEvent.VK_QUOTE);
	        	r.keyRelease(KeyEvent.VK_QUOTE);
	        } else {
		        r.keyPress(Character.toUpperCase(c));
		        r.keyRelease(Character.toUpperCase(c));
	        }

	        if (uc) {
	            r.keyRelease(KeyEvent.VK_SHIFT);
	        }
	        delay(EVT_DELAY);
	    }
	    r.keyPress(KeyEvent.VK_ENTER);
	    delay(EVT_DELAY);
	    r.keyRelease(KeyEvent.VK_ENTER);
	    delay(EVT_DELAY);
	}
	
	public void delay(int ms) {
		try {
			Thread.sleep(ms);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
