document.addEventListener("DOMContentLoaded",
()=>
{

    const GRID_WIDTH = 20
    const GRID_HEIGTH = 20;
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGTH;
    
    let TotalScore = document.querySelector("#score");
    let scoreValue = 0;

    let timerID;
    let gameSpeed = 300;


    const StartBtn = document.getElementById("start_btn");
    const SpeedUpBtn = document.getElementById("speed_up_btn");
    const SpeedDownBtn = document.getElementById("speed_down_btn");

    const shapes_styles = ["shape_L","shape_Z","shape_T","shape_O","shape_I"];



    //seleccionamos la grid y creamos 400 elementos
    // (una grid de 20 cuadrados x 20 cuadrados)

    // make a grid of 20x20 squares
    const grid_container = document.querySelector(".grid_container");

    //make a 4x4 square grid to preview the next shape
    const preview_grid_container = document.querySelector(".preview_grid_container");


    // fill the grid container with divs
    for(let index = 0; index < 420; index++)
    {
        let new_div = document.createElement("div");
        new_div.setAttribute("id",index.toString());

        if(index >= 400 )
        {
            // estos son para formar una linea en el fondo de la pantalla
            // para evitar que las piezas sigan bajando
            //this are for making a line in the bottom of the screen
            // to stop the shapes once they reach the bottom of the screen
            new_div.classList.add("taken");
        }

        grid_container.appendChild(new_div);
    }


    let squares = Array.from(grid_container.querySelectorAll("div"));



    // fill the preview grid with divs
    for(let index = 0; index < 16; index++)
    {
        let new_div = document.createElement("div");
        new_div.setAttribute("id",index.toString());

        preview_grid_container.appendChild(new_div);
    }


    let preview_squares = Array.from(preview_grid_container.querySelectorAll("div"));

    const PREVIEW_WIDTH = 4;
    let preview_index = 0;





    //console.log(squares);


    // LAS PIEZAS --- THE "TETROMINOES"
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------

    // NOTA IMPORTANTE: Para entender como estan dibujadas las rotaciones pensar que 
    // todos los cuadrados estan uno al lado del otro (gracias al flexbox)
    // y que cada GRID_WIDTH espacios saltan a la linea de abajo (gracias al wrap)
    // entonces si queremos verlos hay que tener en cuenta que estamos trabajando con un array
    // observar la imagen para entender mejor 
    /*
        0   1  2  3  4  5  6  7  8  9  10  11  12....
        20 21 22 23 24 25 26 ... 
        40 41 42 43 44 ...
        60 61 62 63 64 ...

        si quiero dibujar la forma 

         0  *  *
         20 * 22
         40 * 42

         y de ahi salen los valores [ 1, width +1, (width * 2) +1, 2] para dibujar esta rotacion

    */
   
    // hacemo un array de 4 elementos, cada uno 
    // es un array que representa una de sus rotaciones 

    // we make a 4 element array, each one is an array itself, representing a rotation of the L shape



    // la que tiene forma de L --- the L shaped tetrominoe
    //-------------------------------------------------------------------
    const shape_L = [
        [1, (GRID_WIDTH+1), (GRID_WIDTH * 2)+1,2],
        [GRID_WIDTH, (GRID_WIDTH+1),(GRID_WIDTH+2),(GRID_WIDTH * 2) +2],
        [1,(GRID_WIDTH+1),(GRID_WIDTH * 2), (GRID_WIDTH *2 )+1],
        [GRID_WIDTH,(GRID_WIDTH * 2),(GRID_WIDTH *2 )+1,(GRID_WIDTH *2 )+2]
    ]


    // la que tiene forma de Z --- the Z shaped tetrominoe
    //-------------------------------------------------------------------
    const shape_Z = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
    ]
    


    // la que tiene forma de T --- the T shaped tetrominoe
    //-------------------------------------------------------------------
    const shape_T = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
    ]
    
    

    // la que tiene forma de cuadrado --- the squared shape tetrominoe
    //-------------------------------------------------------------------
    const shape_O = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
    ]
    
    

    // la que tiene forma de palo --- the I shaped tetrominoe
    //-------------------------------------------------------------------
    const shape_I = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
    ]


    
    // ponemos todas las shapes en un array --- make an array with the tetrominoes
    const tetris_shapes = [shape_L,shape_Z,shape_T,shape_O,shape_I];



    // ponemos todas las piezas del preview en un array
    // make the preview_shape array
    const previewShapeArray = [
        [1, (PREVIEW_WIDTH+1), (PREVIEW_WIDTH * 2)+1,2],
        [0, PREVIEW_WIDTH, PREVIEW_WIDTH + 1, PREVIEW_WIDTH * 2 + 1],
        [1, PREVIEW_WIDTH, PREVIEW_WIDTH + 1, PREVIEW_WIDTH + 2],
        [0, 1, PREVIEW_WIDTH, PREVIEW_WIDTH + 1],
        [1, PREVIEW_WIDTH + 1, PREVIEW_WIDTH * 2 + 1, PREVIEW_WIDTH * 3 + 1]
    ];
    



    // elegimos una posicion para empezar y una pieza al azar como la inicial
    // pick a random starting shape and a position
    let currentPosition = 4;
    let currentRotation = 0;
    let currentShape;
    let random_shape;
    let nextRandomShape = 0;
    
   

    // dibujar las piezas
    // draw the shapes
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function drawShape()
    {
        currentShape.forEach( 
        (index) =>
        {   
            //console.log(index)
            // squares es el array que tiene todos los <div> de adentro del container
            // que es el div con la clase grid_container
            squares[currentPosition + index].classList.add(shapes_styles[random_shape]);
        })
    }



    // undrawShape
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function undrawShape()
    {
        currentShape.forEach( 
        (index) =>
        {   
            // squares es el array que tiene todos los <div> de adentro del container
            // que es el div con la clase grid_container
            squares[currentPosition + index].classList.remove(shapes_styles[random_shape]);
        })
    }





    // get new shape
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function getNewShape()
    {
        random_shape = nextRandomShape;
        
        nextRandomShape = Math.floor(Math.random() * tetris_shapes.length);
        

        // currentShape es un array de 4 valores!!! 
        // que son la combinacion de una pieza + su rotacion
        currentShape = tetris_shapes[random_shape][currentRotation];

        currentPosition = 4; // empieza desde arriba --- starts from the top

        drawShape();
        displayNextShape();
    }
    
    getNewShape();
    
    


    // detener las pieza
    // freeze the shape
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function freezeShape()
    {

        //if the next "line" starting from the current position (that is the + GRID_WIDTH for)
        // has the class taken
        let isCollisionSquare = currentShape.some(
            (index) => squares[currentPosition + index + GRID_WIDTH].classList.contains("taken") )

        if(isCollisionSquare)
        {   
            // turn all the squares of the current shape into that class
            currentShape.forEach(
                (index) => squares[currentPosition + index].classList.add("taken"))

                getNewShape();
        }
    }




    // mover la pieza para abajo constantemente
    // move the shape down constantly 
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function autoScrollShapeDown()
    {
        undrawShape();
        currentPosition += GRID_WIDTH; // baja 1 linea cada x tiempo
        drawShape();

        // constantly checked methods
        freezeShape();
        addScore();
        gameOver();

        if(isGameOver)
        {
            StartBtn.textContent = "Try Again ? ";
        }
    }


    // activamos la funcion para mover las piezas 500 es tiempo en milisegundos
    // move the shapes down , 500 are the miliseconds between each function call


    // this bool prevents the rotation of the shape while being in the left or right edge
    // of the game screen (without it the shape can rotate and its parts appear from the other side)
    let canRotate = true;
    let isGamePaused = true;
    let isGameOver = false;

    // control the shapes with keyboard 
    // controls :
    // a s d --- for movement
    // space bar       --- for rotation
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------

    
    function userInput(e)
    {
        if(!isGamePaused)
        {
            switch (e.keyCode)
            {
                // a --- left
                case 65:
                    moveShapeLeft();
                break;
    
                
                // s --- down
                case 83:
                    speedUpShape();
                break;
    
    
                // d --- right
                case 68:
                    moveShapeRight();
                break;
    
    
                // w  --- rotate/change rotation
                case 87:

                    if(canRotate)
                    {
                        rotateShape();            
                    }
    
                break;
            }
        }
    }

    document.addEventListener("keydown",userInput);



    // rotar la pieza
    // rotate the shape
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function rotateShape()
    {
        undrawShape();

        currentRotation++;

        if(currentRotation === currentShape.length)
        {
            currentRotation = 0;
        }
        
        currentShape = tetris_shapes[random_shape][currentRotation];
        
        drawShape();
    }


    // speed up the shape movement towards the bottom
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function speedUpShape()
    {
        undrawShape();

        currentPosition += GRID_WIDTH;

        let isCollisionSquare = currentShape.some(
            (index) => squares[currentPosition + index + GRID_WIDTH].classList.contains("taken") )


        if(isCollisionSquare)
        {   
            // turn all the squares of the current shape into that class
            currentShape.forEach(
                (index) => squares[currentPosition + index].classList.add("taken"))

                currentPosition -= GRID_WIDTH;
                drawShape();
                
        }
        else
        {
            drawShape();
        }
    }


    // mover la pieza para la izquierda
    // move the shape left
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function moveShapeLeft()
    {
        undrawShape();

        // check to see if the shape is at the edge of the grid
        // this is to prevent the shape going out and appear from the other side of the grid
        const isAtLeftEdge = currentShape.some(
            (index) => (currentPosition + index) % GRID_WIDTH === 0);

        
        if(!isAtLeftEdge)
        {
            currentPosition -=1;
            canRotate = true;
        }
        else if (isAtLeftEdge)
        {
            canRotate = false;
        }


        let isCollisionSquare = currentShape.some(
            (index) => squares[currentPosition + index].classList.contains("taken"))
        
        
        if(isCollisionSquare)
        {
            currentPosition+=1 // dont move the shape to the left 
        }

        drawShape();

    }





    // mover las pieza para la derecha
    // move the shape right
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function moveShapeRight()
    {
        undrawShape();

        // check to see if the shape is at the edge of the grid
        // this is to prevent the shape going out and appear from the other side of the grid
        const isAtRightEdge = currentShape.some(
            (index) => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH -1);

        
        if(!isAtRightEdge)
        {
            currentPosition +=1;
            canRotate = true;
        }
        else if(isAtRightEdge)
        {
            canRotate = false;
        }


        let isCollisionSquare = currentShape.some(
            (index) => squares[currentPosition + index].classList.contains("taken"))
        
        
        if(isCollisionSquare)
        {
            currentPosition-=1 // dont move the shape to the Right 
        }

        drawShape();

    }



    // Display the previewShape
    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    function displayNextShape()
    {
        preview_squares.forEach((item) => item.classList.remove(shapes_styles[random_shape]));

        previewShapeArray[nextRandomShape].forEach(
            (index) => preview_squares[preview_index + index].classList.add(shapes_styles[nextRandomShape]));
    }




    // gameOver
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    function gameOver()
    {
        if(currentShape.some((index) => squares[currentPosition +index].classList.contains("taken")))
        {
            TotalScore.innerHTML = "--- GAME OVER ---";
            clearInterval(timerID);
            isGameOver = true;
        }
    }



    // restartGame
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    function restartGame()
    {
        //vuelve todos los div a como estaban originalmente
        squares.forEach(item => {
             item.classList.remove(shapes_styles[random_shape]);

            if(parseInt(item.id) < 400)
            {
                item.classList.remove("taken")
            }
            });

        scoreValue = 0;
        
        TotalScore.innerHTML = scoreValue.toString();
        
        isGameOver = false;
        
        getNewShape();
    }


    // boton start/stop
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    StartBtn.addEventListener("click",
    ()=>
    {
        if(timerID)
        {
            clearInterval(timerID);
            timerID = null;
            StartBtn.textContent = "Start";
            if(!isGameOver)
            {
                isGamePaused = true;
            }
        }
        else
        {
            timerID = setInterval(autoScrollShapeDown,gameSpeed);
            StartBtn.textContent = "Pause";

            if(!isGameOver)
            {
                isGamePaused = false;
            }
            else
            {
                restartGame();
            }
        }
    })


    // speed up
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    SpeedUpBtn.addEventListener("click",() =>{
        
        if(gameSpeed > 100)
        {
            gameSpeed -= 100;
        }

        clearInterval(timerID);
        timerID = setInterval(autoScrollShapeDown,gameSpeed); 
    });
    
    // speed down
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    SpeedDownBtn.addEventListener("click",() => {
        gameSpeed += 100;
        clearInterval(timerID);
        timerID = setInterval(autoScrollShapeDown,gameSpeed);
    });

    
    // score
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    function addScore()
    {
        const row = [];

        for(let i = 0;i < 399; i+= GRID_WIDTH)
        {
            for (let q = 0; q < 20; q++) 
            {    
                row[q] = i+q;
            }

            if(row.every((index) => squares[index].classList.contains("taken")))
            {
                scoreValue +=10;
                TotalScore.innerHTML = scoreValue.toString();
                
                row.forEach(
                    (index) =>{
                        squares[index].classList.remove("taken");

                        for (let a = 0; a < shapes_styles.length; a++)
                        {
                            squares[index].classList.remove(shapes_styles[a]);
                        }
                    }
                );

                const squaresRemoved = squares.splice(i,GRID_WIDTH);

                squares = squaresRemoved.concat(squares);

                squares.forEach((cell) => grid_container.appendChild(cell));
            }
        }
        //console.log(row);
    }
    
    
    
    

});