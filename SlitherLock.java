/* SlitherLock Mouse Mod by Thor Lancaster 
 Keeps the mouse close to the center of the screen
 for optimal snake control.

 By default the radius is 100 pixels, 
 although that is changeable with a command-line\
 argument. 
 For example:
 java -jar slitherlock.jar 200 for a radius of 200
 pixels from the center of the screen.

 For best results the slither.io window should be 
 Fullscreen.

 Released under the GPLv3 License
*/

import java.awt.AWTException;
import java.awt.Dimension;
import java.awt.MouseInfo;
import java.awt.PointerInfo;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JFrame;
import javax.swing.Timer;

public class SlitherLock {
	Timer timer;
	Robot robot;
	JFrame frame;
	Dimension screen;
	int threshold = 100;
	int delay = 33;

	public static void main(String[] args) {
		new SlitherLock().init(args);
	}

	private void init(String[] args) {
		try{
			threshold = Integer.parseInt(args[0]);
		}
		catch(Exception e){
			
		}
		try {
			robot = new Robot();
		} catch (AWTException e) {
			System.err
					.println("Failed to create Java Robot. The Program Will Exit.");
			System.exit(0);
		}

		frame = new JFrame();
		frame.setMinimumSize(new Dimension(500, 32));
		frame.setTitle("SlitherLock mouse mod by Thor Lancaster");
		frame.setResizable(false);
		frame.pack();
		frame.setVisible(true);
		screen = Toolkit.getDefaultToolkit().getScreenSize();
		ActionListener taskPerformer = new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				timerTick();
			}
		};
		timer = new Timer(delay, taskPerformer);
		timer.start();
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}

	private void timerTick() {
		boolean update = false;
		PointerInfo info = MouseInfo.getPointerInfo();
		int mouseX = info.getLocation().x;
		int mouseY = info.getLocation().y;
		int screenWidth = screen.width;
		int screenHeight = screen.height;
		
		mouseX -= screenWidth/2;
		mouseY -= screenHeight/2;
		
		if(mouseX*mouseX + mouseY*mouseY > threshold*threshold){
			double angle = Math.atan2(mouseY, mouseX);
			mouseX = (int)(Math.cos(angle)*threshold);
			mouseY = (int)(Math.sin(angle)*threshold);
			update = true;
		}
		
		mouseX += screenWidth/2;
		mouseY += screenHeight/2;
		
		if(update){
			robot.mouseMove(mouseX, mouseY);
		}
	}

}