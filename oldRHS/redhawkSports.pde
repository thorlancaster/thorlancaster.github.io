PImage right;
int Pw, Ph = 0;
int BB_Ngames = 22;
String[] basketball;
String[] results;
String[] track;
int colSpacing = 36;
int colWidth = 184;
PImage BBgraph;
boolean BBgraphLoaded = false;
PImage VBgraph;
boolean VBgraphLoaded = false;
PImage TFgraph;
boolean TFgraphLoaded = false;
int offset = 0;
int offsetTarget = 0;

int basketballOffset = 0;
int footballOffset = -2000;
int volleyballOffset = -1000;
int trackOffset = 1000;

boolean rightClicked = false;
int RCx = 0;
int RCy = 0;
boolean statview = false;
int statNBR = 0;
int endOfGraphY = 0;
boolean scrolling = false;
int H1 = 0;
int H2 = 0;
int H3 = 0;
int H4 = 0;
int G1 = 0;
int G2 = 0;
int G3 = 0;
int G4 = 0;
int HT = 0;
int GT = 0;
String rawScoreData = "";
String[] scoreData = new String[32];
void setup()
{
  basketball = loadStrings("basketball.txt");
  results = loadStrings("varsityresults.txt");
  right = loadImage("right.png");
  track = loadStrings("track.txt");
  //  track = track.replaceAll('_','N');
  //  chris = loadStrings("https://38b4667cc6c31003a32b74b1ac5916ec525e5a65.googledrive.com/secure/ABCTMEifQC_IfbsF9PYudzSD_lgSp5k9_X-cMUG5lN-UT2R6az1t0DCzqZ25rjxdtcGbREngOGyHg16ahBli56IKTMdWVz34NPxuXVYix-98dGd5fMlQcWLgMASTSlK73JPqYwUpkkEFzQ6UlrtZc3NK80zt6c871Hp9wnQaqcAWtJDSJ0WdQeNEv5dajiiEGC392plWRz_foNTjltQXUvnwJx2fgR5IdoWH3rpyO_Om85BDxNP80HPXoyqB_GZAfCk-fpr0UUlw4-EaZDupUgoG69ZcEYK8PlMYhfrtR_OFecz8n7muhXGcmEiz-2ArzWbvG3JIO3YvKRGMCCycZFN_dXwO-s4D4lhpxem6JNQ_bf54eheSzuGcs098nqxcufBzJF3AQa-_Kg24wd2fkKQWmKBx5IMnh5xK-hU24URvkYrBaKnlLMpNR5AEqPYTKLFUBgo6gW0Yauto3oiKf5cvEMFvrc7_f8eBPHFjaOz10CQ9iYc3iMH3P2gIbUOkcY0hO8NDEjUBwZoHPGCVCOGZghhozYHMZLsvp-UYRl-emWB1zfG4SPsMVoEZqfIVw4u-Fy1iolqg/host/0B7TZ73SpMR0vckpQYmktbnZ2cjA");
  frameRate(30);
  strokeCap(SQUARE);
  endOfGraphY = 196+colSpacing*BB_Ngames;
}
void reset()
{
  size(max(colWidth*6.2, window.innerWidth-25), 1500); 
  push = (1330-width)/2;
  background(0);
  textSize(40);
  fill(#ff0000);
  header("Froid Medicine Lake Redhawk Sports ", 40);
  stroke(#ffffff);
  strokeWeight(2);
  horizontalDiv(50);
  horizontalDiv(75);
  textSize(25);
  header("Football          Volleyball          Basketball          Track", 71);
  textSize(20);
  stroke(255, 0, 0); // grid color

  if (!BBgraphLoaded)
  {
    for (int x = 0; x < 5; x++)
    {
      for (int y = 0; y < BB_Ngames; y++)
      {
        fill(30, 30, 30); // grid background color
        rect(x*colWidth + width/2 - (2*colWidth), y*colSpacing+200, colWidth, 32);
        fill(255, 255, 255); // text fill color
        text(basketball[y + (x*BB_Ngames)], (x*colWidth + width/2 - (colWidth*1.5))-textWidth(basketball[y + (x*BB_Ngames)])/2, y*colSpacing+223);
      }
    }
    text("  Date", width/2-(colWidth*2)+60, 170);
    text("Opponent", width/2-(colWidth*2)+50+colWidth, 170);
    text(" Place", width/2-(colWidth*2)+60+colWidth*2, 170);
    text(" Time", width/2-(colWidth*2)+60+colWidth*3, 170);
    text(" Results", width/2-(colWidth*2)+60+colWidth*4, 170);
    text("Click to expand", width/2-(colWidth*2)+colWidth*4+17, 190);
    BBgraph = get(width/2-(colWidth*2), 150, 5*colWidth+10, (BB_Ngames*colSpacing)+50);
    BBgraphLoaded = true;
  } else 
  {
    image(BBgraph, width/2-(colWidth*2.5) + offset, 150);
  }
  if (offsetTarget == basketballOffset || offsetTarget == trackOffset)
    text(track[0].replaceAll("_", "\n"), -700+offset, 100, width-200, 10000);
}

void checkPageSize() {
  if (Pw != window.innerWidth || Ph != window.innerHeight) reset();  
  Pw = window.innerWidth; 
  Ph = window.innerHeight;
}
void header(String Xin, int Yin) {
  text(Xin, ((width/2)-textWidth(Xin)/2), Yin);
}
void horizontalDiv(int Xin) {
  line(0, Xin, width, Xin);
}

void draw()
{ 
  if (!statview)
  {

    // checkPageSize();
    if (!rightClicked)
    {
      reset();
      if (offset < offsetTarget)
        offset+=max(1, (offsetTarget-offset)/9);
      if (offset > offsetTarget)
        offset-=max(1, (offset-offsetTarget)/9);
      if (offset < offsetTarget - 1 || offset > offsetTarget+1)
        scrolling = true;
      else
        scrolling = false;
      fill(0, 255, 0);
    }
    if (!scrolling && mouseX > (width/2)+(colWidth*1.5) && mouseX < (width/2)+(colWidth*2.5) && mouseY > 200 && mouseY < endOfGraphY)
      cursor(HAND);
    else
      cursor(ARROW);
  } else
  {
    if (mouseX < 83)
      cursor(HAND);
    else
      cursor(ARROW);
    try {
      background(0);
      fill(255);
      text(split(results[statNBR], "<s>")[0].replaceAll("_", "\n"), 100, 100, width-200, 10000);
      rawScoreData = split(results[statNBR], "<s>")[1];
      H1 = int(split(rawScoreData, ","))[2];
      H2 = int(split(rawScoreData, ","))[3];
      H3 = int(split(rawScoreData, ","))[4];
      H4 = int(split(rawScoreData, ","))[5];
      G1 = int(split(rawScoreData, ","))[6];
      G2 = int(split(rawScoreData, ","))[7];
      G3 = int(split(rawScoreData, ","))[8];
      G4 = int(split(rawScoreData, ","))[9];
      HT = int(split(rawScoreData, ","))[10];
      GT = int(split(rawScoreData, ","))[11];
      text(split(rawScoreData, ",")[0], width/2-220, 20);
      text(H1, width/2-40, 20);
      text(H2, width/2, 20);
      text(H3, width/2+40, 20);
      text(H4, width/2+80, 20);
      text(HT, width/2+120, 20);

      text(split(rawScoreData, ",")[1], width/2-220, 45);
      text(G1, width/2-40, 45);
      text(G2, width/2, 45);
      text(G3, width/2+40, 45);
      text(G4, width/2+80, 45);
      text(GT, width/2+120, 45);

      H1 = int(split(rawScoreData, ","))[12];
      H2 = int(split(rawScoreData, ","))[13];
      H3 = int(split(rawScoreData, ","))[14];
      H4 = int(split(rawScoreData, ","))[15];
      G1 = int(split(rawScoreData, ","))[16];
      G2 = int(split(rawScoreData, ","))[17];
      G3 = int(split(rawScoreData, ","))[18];
      G4 = int(split(rawScoreData, ","))[19];
      HT = int(split(rawScoreData, ","))[20];
      GT = int(split(rawScoreData, ","))[21];

      text(H1, width/2+200, 20);
      text(H2, width/2+240, 20);
      text(H3, width/2+280, 20);
      text(H4, width/2+320, 20);
      text(HT, width/2+360, 20);

      text(G1, width/2+200, 45);
      text(G2, width/2+240, 45);
      text(G3, width/2+280, 45);
      text(G4, width/2+320, 45);
      text(GT, width/2+360, 45);

      fill(255, 0, 0);
      text("Varsity Boys", width/2, 72);
      text("Varsity Girls", width/2+233, 72);
      fill(255, 255, 255);
    }
    catch(e)
    {
      background(0);
      text("Stats/scores have not been entered for game " + statNBR, 100, 100);
    }

    fill(255, 0, 0);
    rect(0, 0, 82, height);
    fill(0);
    text("C\nL\nI\nC\nK\n \nT\nO\n \nC\nL\nO\nS\nE", 30, 200, 30, 1000);
  }
  //  fill(((millis()/20))%255,((millis()/20)+85)%255,((millis()/20)+170)%255);
  //  text("Chris's page",width/2-100,height-20);
}

void mousePressed()
{
  if (!statview)
  {
    if (rightClicked && mouseButton == LEFT)
    {
      if (mouseX > RCx && mouseY > RCy + 54 && mouseX < RCx + 263 && mouseY < RCy+82)
      {
        link("http://subinsb.com/make-a-blank-blogger-template", "_new");
      }
      rightClicked = false;
    } //
    {
      if (mouseButton == RIGHT && !rightClicked)
      {
        image(right, mouseX, mouseY);
        rightClicked = true;
        RCx = mouseX;
        RCy = mouseY;
      } else
      {
        if (mouseY<75 && mouseY > 50)
        {
          if (mouseX > 370-push && mouseX < 470-push)
          {
            offsetTarget = footballOffset;
            endOfGraphY = 0;
          }
          if (mouseX > 533-push && mouseX < 648-push)
          {
            offsetTarget = volleyballOffset;
            endOfGraphY = 0;
          }
          if (mouseX > 711-push && mouseX < 831-push)
          {
            offsetTarget = basketballOffset;
            endOfGraphY = 196+colSpacing*BB_Ngames;
          }
          if (mouseX > 895-push && mouseX < 962-push)
          {
            offsetTarget = trackOffset;
            endOfGraphY = 0;
          }
        }
        if (!scrolling && mouseX > (width/2)+(colWidth*1.5) && mouseX < (width/2)+(colWidth*2.5) && mouseY > 200 && mouseY < endOfGraphY)
        {
          statview = true;
          statNBR = (int((mouseY-200)/colSpacing));
          window.scrollTo(0, 0);
        }
        rightClicked = false;
      }
    }
  } else
  {
    if (mouseX < 83)
    {
      statview = false;
      window.scrollTo(0, 0);
    }
  }
}
void mouseMoved()
{
}
void keyPressed()
{
  if (keyCode == DOWN)
  {
    window.scrollBy(0, 50);
  }
  if (keyCode == UP)
  {
    window.scrollBy(0, -50);
  }
}
String.prototype.replaceAll = function( 
strTarget, 
strSubString
) {
  var strText = this;
  var intIndexOfMatch = strText.indexOf( strTarget );
  while (intIndexOfMatch != -1) {
    strText = strText.replace( strTarget, strSubString )
      intIndexOfMatch = strText.indexOf( strTarget );
  }
  return( strText );
}

