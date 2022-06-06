# Ceros Ski Code Challenge - TypeScript Edition

Welcome to the Ceros Ski Code Challenge!

For this challenge, we have included some base code for Ceros Ski, our version of the classic Windows game SkiFree. If
you've never heard of SkiFree, Google has plenty of examples. Better yet, you can play our version here:
http://ceros-ski.herokuapp.com/  
[Solution Demo Link](https://ben-ceros-ski.netlify.app/)

Or deploy it locally by running:

```
yarn
yarn dev
```

**How To Play**

- Use the arrow keys to turn the skier.
- The skier will crash if they hit an obstacle. Use the left/right keys to move away from the obstacle and then down
  to resume skiing.
- At some point the rhino will appear, chasing the skier. It will inevitably catch the skier and eat them, ending the
  game.

**Time Limit**

Solutions should be submitted within a week of receiving the challenge. We expect the challenge to take at most two
hours of your time. We understand that everyone has varying levels of free time and we'd rather you take the time and
produce a solution up to your ability than rush and turn in a suboptimal challenge. If you require more time, please
reach out to us. Look through the requirements below and let us know when you will have something for us to look at.
If anything is unclear, don't hesitate to reach out.

**Requirements**

Throughout your completion of these requirements, be mindful of the design/architecture of your solution and the
quality of your code. We've provided the base code as a sample of what we expect. That being said, we're sure there are
ways the that the design and architecture could be better. If you find a better way to do something, by all means, make
it better! Your solution can only gain from having a better foundation.

- **Add a New Feature:**

  Add in the ability for the skier to jump. The asset files for the ramp and the jumping skier are included. All you
  need do is make them jump.

  Acceptance Criteria:

  - Jump ramps are added to the game world and appear randomly as the skier skis.
  - The skier should enter the jumping state when they hit the jump ramp.
  - The skier should also enter the jumping state when the user presses the spacebar.
  - The skier should do a flip while jumping, at least one cycle through the jump images provided.
  - While jumping, the skier should be able to jump over some obstacles:
    - Rocks can be jumped over
    - Trees can NOT be jumped over

- **Documentation:**

  Update this README file with your comments about your work.

  - What did you do and, more importantly, why you built it the way you did.
  - Are there any known bugs?
  - Did you do any bonus items?
  - Tell us how to run it, either locally or through a cloud provider.

- **Be original:**

  This should go without saying but don’t copy someone else’s game implementation! We have access to Google too!

**Grading**

Your challenge will be graded based upon the following criteria. **Before spending time on any bonus items, make sure
you have fulfilled this criteria to the best of your ability, especially the quality of your code and the
design/architecture of your solutions. We cannot stress this enough!**

- How well you've followed the instructions. Did you do everything we said you should do?
- The quality of your code. We have a high standard for code quality and we expect all code to be up to production
  quality before it gets to code review. Is it clean, maintainable, unit-testable, and scalable?
- The design of your solution and your ability to solve complex problems through simple and easy to read solutions.
- How well you document your solution. We want to know what you did and **why** you did it.

**Bonus**

_Note: You won’t be marked down for excluding any of this, it’s purely bonus. If you’re really up against the clock,
make sure you complete all of the listed requirements and to focus on writing clean, well organized, well documented
code before taking on any of the bonus._

If you're having fun with this, feel free to add more to it. Here's some ideas or come up with your own. We love seeing
how creative candidates get with this.

- Provide a way to reset the game once it's over
- Provide a way to pause and resume the game
- Add a score that increments as the skier skis further
- Increase the difficulty the longer the skier skis (increase speed, increase obstacle frequency, etc.)
- Deploy the game to a server so that we can play it without having to install it locally
- Write unit tests for your code

We are looking forward to see what you come up with!!

# Solution

## New features added

* Skier can now jump by pressing `Space bar`.

* Skier can now jump over rocks.

* Skier jumps automatically when in collision with a jump ramp.

* Added game score functionality.

* Added a game board to show the game's current state(paused, playing, game over), score and game controls

* Added functionality to reset the game when it's over by pressing `R`.

* Added functionality to pause/resume by pressing `P`.

* Difficulty increases as skier skis longer.

* Deployment is handled with netlify at [Solution Demo Link](https://ben-ceros-ski.netlify.app/)

## Explanation for jumping over rocks
Rocks are also obstacles hence the simplest solution I could think of was to not recognize a collion with a rock whiles skier is already jumping.

![image](https://user-images.githubusercontent.com/35709836/172260657-b02a1454-a2f7-4c88-bb28-dcfed00f9557.png)

This is handled by the function `canJump` in `SkierJump.ts`.

![image](https://user-images.githubusercontent.com/35709836/172260739-9dc2271b-a54c-46f6-aa09-dc115654843f.png)

## Explanation for pressing space to jump.
If the key pressed is the spacebar, we invoke a method to start the jumping sequence.

![image](https://user-images.githubusercontent.com/35709836/172261210-5813474e-fbb3-442c-9aed-e848a26443a5.png)

Seen in the image above as `this.jump.jumpStart()`.
We keep track of wether the skier is currently jumping and the direction before the jump was initiated.

I set the direction of `DIRECTION_JUMP` so we can handle the jump animation as the skier moves.

![image](https://user-images.githubusercontent.com/35709836/172261483-9abbaa51-e600-4aa2-9610-77fc81a7c4ad.png)

![image](https://user-images.githubusercontent.com/35709836/172261806-4981d91d-796d-430e-b15a-81667d3a1809.png)

Each visible jumping sequence image can only be seen as the skier moves, hence we pick the next jump sequence image only after our asset animation timer catches up to the speed of the skier

![image](https://user-images.githubusercontent.com/35709836/172263051-b9fc7d9c-77d1-4600-8051-3562a6b2af63.png)

## Explanation for jumping on ramps automatically.
When the skier collides with an obstacle, if said obstacle is a jump ramp, we call the method to start the jump sequence

![image](https://user-images.githubusercontent.com/35709836/172263780-7099f7f4-1608-4dff-90fb-f311ecf1dc9d.png)


## Explanation for scores
We only increment the scores for movements. Direct Left and Right movements are not awarded any points.
* Jump = 2 points
* Left/Right Diagonal movement = 1 point
* Down movement = 1 point
* Top = 0 points
* Direct Left/Right = 0 points


