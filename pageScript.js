    $(document).ready(function(){

        var pagePos = null;
        var deltaPagePos = null;
        var prevScrollTime = null;
        var currentScrollTime = null;
        var isCompressed = null;
        var navAnimation = null;
        var previousFrame = null;
        var animationT = 0;
                
        
        //removes added hash from url
        function remove_hash() {
            history.replaceState("", document.title, window.location.pathname + window.location.search);
        }
        
        //reterns a value between start and end values based on the 0-1 step value
        function Lerp(start, end, step){
            var output = step * (end - start) + start;
            return output;
        }
        
        function SetNavState(compressed){
            if(isCompressed != null && compressed != isCompressed){
                isCompressed = compressed;
                //stop anim
                if(navAnimation != null){
                    clearInterval(navAnimation);
                    navAnimation = null;
                }
                
                var speed = Math.abs(deltaPagePos * (currentScrollTime - prevScrollTime));
                
                totalAnimTime = (-1250 * speed) + 237.5;
                
                //limit
                if(totalAnimTime < 50){
                    totalAnimTime = 50;
                }else if(totalAnimTime > 200){
                    totalAnimTime = 200;
                }
                
                
                previousFrame = Date.now();
                navAnimation = setInterval(function() {AnimateNavbar(compressed, totalAnimTime);}, 0);
            }
        }
        
        function AnimateNavbar(isCompressing, totalAnimTime){
            
            //in MILLIseconds
        
            var directionFactor;
            
            if(isCompressing){
                directionFactor = 1;
            }else{
                directionFactor = -1;
            }

            
            var thisTime = Date.now();
            var deltaTime = (thisTime - previousFrame);

            previousFrame = thisTime;
            
            //animate by delta time
            animationT = animationT + (deltaTime/totalAnimTime) * directionFactor;
            
            //limit
            if(!isCompressing && animationT <= 0){
                
                animationT == 0;
                CompressVertically(animationT);

                //end routine
                clearInterval(navAnimation);
                navAnimation = null;
//                console.log("fully DE-compressed")
                return;
            }else if(isCompressing > 0 && animationT >= 1){
                animationT = 1;
                CompressVertically(animationT);
                
                //end routine
                clearInterval(navAnimation);
                navAnimation = null;
//                console.log("fully Compressed");
                return;
            }
            
            //apply
            CompressVertically(animationT);
            
        }
        
        //vertically compresses all aspects of navbar based on the 0-1 inputed t/step value 
        function CompressVertically(t){
            
            if(t > 1){
                t=1;
            }else if (t < 0){
                t=0;
            }
            
            //lerp values
            //.container-fluid.primary
            $(".container-fluid.primary").css("margin-top", Lerp(-0.4,-3.5,t) +"em");
                //margin-top: -.4em : -3.5em;
            //.container-fluid.seporator
            $(".container-fluid.seperator").css("margin-top", Lerp(.5,-2.7,t) +"em");
                        //margin-top: .75em : -2.7em;
            //.container-fluid.secondary
            $(".container-fluid.secondary").css("margin-top", Lerp(1.5,-0.25,t) +"em");
                        //margin-top: 1.5em : -.25em;
            //.socialIcon
            $(".socialIcon").css("height", Lerp(40,30,t) +"px");
    //            height: 40px - 30px;
            $(".socialIcon").css("width", Lerp(40,30,t) +"px");
    //            width: 40px - 30px;
            $(".socialIcon").css("margin-top", Lerp(3.75,2,t) +"em");
    //            margin-top: 3.75em - 2em;
            //.logo
            $(".logo").css("height", Lerp(80,50,t) +"px");
    //            height: 80px - 50px;
            $(".logo").css("width", Lerp(80,50,t) +"px");
    //            width: 80px - 50px;
            $(".logo").css("margin-top", Lerp(1.5,.6,t) +"em");
    //            margin-top: 1.5em - .75em;
            //.navbar-header
            $(".navbar-header").css("font-size", Lerp(4.5,1.8,t) +"em");
                //font-size: 4.5em - 1.5em
            $(".navbar-header").css("margin-bottom", Lerp(0,1.5,t) +"em");
    //            margin-bottom: 0em - 1.5em;
//            $(".navbar-header").css("margin-left", Lerp(.4,.8,t) +"em");
    //            margin-left: .4em - .8em;
//            $(".navbar-header").css("padding-left", Lerp(1.5,3,t) +"em");
    //              padding-left: 1.5 - 2.75
            $(".navbar-header").css("margin-top", Lerp(0,-0.1,t) +"em");
            //.navbar
            $(".navbar").css("height", Lerp(11,6,t) +"em");
                //height: 11em - 6em
            
            //modify background alpha and shadow
            $(".navbar").css("background", "rgba(137,136,133," + (t * 0.95) +")");
            $(".navbar").css("box-shadow", "1.5px 3px 5px rgba(40, 40, 40," + (t * 0.09) + ")");
        }
        
        //modifies the navbar based on scroll position
        function modifyByScroll(){       
            var s = $(window).scrollTop(),
            d = $(document).height();

            var prevPage = pagePos;
            pagePos = (s/d);
            if(prevScrollTime == null){
                currentScrollTime = Date.now();
                prevScrollTime = currentScrollTime;
                
            }else{
                prevScrollTime = currentScrollTime;
                currentScrollTime = Date.now();
            }
            deltaPagePos = pagePos - prevPage;
            
            if(isNaN(pagePos)){
                console.log("NAN");
                SetNavState(false);
                highlightSection(0,d);
            }else
            {
                //highlights/crossesOut the page section link based on the position on the page
                highlightSection(pagePos,d);
                
                //limit t
                if(isCompressed != null){
                    var t = 31.25 * pagePos;
                    if(t >= 0.1){
                        SetNavState(true);
                    }else if (t < 0.1){
                        SetNavState(false);
                    }
                } 
            }
        }
        
        //on page load sets starting navbar compression
        function setStartingNavState(){
            var t = 31.25 * pagePos;
            isCompressed = false;
            if(t >= 0.1){
                t = 1; 
                isCompressed = true;
            }else if (t < 0.1){
                t = 0;
                isCompressed = false;
            }
            
            animationT = t;
            CompressVertically(t);
            
            $(".navbar-default").removeClass("hidden");
        }
        
        //switches between desktop and mobile navbar based on window width
        function mobileSwitch(){
            var w = $(document).width();
//            console.log("width: " + w);
            var switchPoint = 1000;
            //if document width is lessthan or equal to certain amount
            
            if(w <= switchPoint){
                //add hidden class
                $(".navbar-header").addClass("hidden");
                $(".socialIcon").addClass("hidden");
                $(".logo").addClass("hidden");
            }else{
                //remove hidden class
                $(".navbar-header").removeClass("hidden");
                $(".socialIcon").removeClass("hidden");
                $(".logo").removeClass("hidden");
            }
        }
        
        //highlights section-links by position
        function highlightSection(pagePosition, docHeight){
            //link data stored in parrallel arrays
            // //id of link
            // var linkIDs = ["#projectInversionLink","#breakoutLink"];
            // //id of sections linked to
            // var sectionIDs = ["#projectInversion","#breakout"];            

            //id of link     
            var linkIDs = ["#link1","#link2"];
            //id of sections linked to
            var sectionIDs = ["#sect1","#sect2"];     


            var h = $(window).height();
            var bottomOfPage = pagePosition + (h/docHeight);
//            console.log("pagePos: " + pagePosition);
//            console.log("bottomOfPage: " +bottomOfPage);
            
            if(pagePosition == 0){
                //un-highlight all section links
                for(i=0; i<linkIDs.length;i++){
                    $(linkIDs[i]).removeClass("currentSection");
                }
            }else
            if(bottomOfPage >= 0.99){
                for(i=0;i<linkIDs.length;i++){
                    if(i == linkIDs.length -1){
                        $(linkIDs[i]).addClass("currentSection");
                    }else{
                        $(linkIDs[i]).removeClass("currentSection");   
                    }
                }
            }else{
                
                //fill elements
                var elements = [];
                var i;
                for(i=0; i < sectionIDs.length;i++)
                {
                    elements.push(document.querySelector(sectionIDs[i]));
                }
                //fill positions
                var positions = [];
                var i;
                for(i=0;i<elements.length;i++){
                    var rect = elements[i].getBoundingClientRect();
                    var y = rect.top;
                    //when at position ratio is 0
                    // when bellow position ratio is negative
                    var ratio = y/docHeight;
                    //console.log(linkIDs[i] + ": " + ratio);
                    positions.push(ratio);
                }
                
                
                var currentSection = -1;
                
                for(i=0; i<positions.length;i++){
                    //if page position is bellow sectionPosition
                    //set highlightIndex to i
                    
                    if(positions[i]<=0.004){
                        currentSection = i;
                    }
                    
                    if(currentSection != -1 && currentSection != i){
                        //page position is within the highlightIndex
                        break;
                    }
                }
                
                //highlight the currentSection
                //un-highlight all others
                for(i=0; i < linkIDs.length;i++){
                    if(i == currentSection){
                        //add highlighted to class
                        $(linkIDs[i]).addClass("currentSection");
                    }else{
                        //remove highlihted from class
                        $(linkIDs[i]).removeClass("currentSection");
                    }
                }
            }
            
        }
        
        modifyByScroll();
        setStartingNavState();
        mobileSwitch();
        window.addEventListener("resize",mobileSwitch);
        window.addEventListener("resize",modifyByScroll);
        
        //run on document scroll
        $(document).scroll(function() { 
//            remove_hash();
            modifyByScroll();
        });
    });