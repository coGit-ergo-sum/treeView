
	function ulToTree(ul){
	
		//if(ul.addChild){return ul;}
		
		
		ul.getFullPath = function(){
		
			let result = [];
			var li = ul.closest('li');
			
			while (li) {

				let spnText = li.querySelector('span.text');
				let text = spnText.innerText;
				
				result.push(text);
				li = li.parentElement.closest('li');
			} 
			
			return result;
		}
		
		/**
		*
		* adds an error li. This function is provided to manage errors in asynchronous functions
		* (with synchronous function the error is managed automatically)
		*
		* @param text- text shown by the 'li'
		* @param jse- the error object 
		*/
		ul.addError = function(text, jse){
			ul.addChild(text, {title: jse.message, icons: {open:'exclamation', close: 'exclamation' }});
		}
			
		/**
		* Adds a generic 'li'
		*
		* @param text- text shown by the 'li'
		*/
		ul.addChild = function(text, options){
		
			var defaults = {
				onexpand: undefined,
				icons   : {open:'open', close:'close', title: text},
				title   : (options.title || text),
				onclick : function (text, li){},
			}	

			// mergeing default options with the provided options (if any) 
			options = Object.assign(defaults, options);
		
			function setIcon(spn_event){
			
				let iconOpen  = spnIcon.getAttribute('data-iconOpen');
				let iconClose = spnIcon.getAttribute('data-iconClose');
				
				spnIcon.classList.remove(iconOpen, iconClose);
				let className = (spn_event == 'onexpand') ? iconOpen : iconClose;
				spnIcon.classList.add(className);				
			}
			
			function spnSign_onAskData(){
		
				let spn = event.currentTarget;
				spn.removeEventListener("click", spnSign_onAskData, false);		
					
				var li = spn.closest('li')
				var ul = li.querySelector("ul");
				var ulTree = ulToTree(ul);	
				try{					
					ul.addChild('loading data', {icons: {open:'wait', close: 'wait' }});
					options.onexpand(ulTree);						
					
					setIcon('onexpand');
				}
				catch(jse){
					ul.addError('error fetching data', jse);					
					console.error(jse);
				}				
				
				lis = ulTree.querySelector("li");
				let hasChildren = (lis != null);
				spn.innerText = hasChildren ? '-' : '';
				if(hasChildren){
					spn.addEventListener('click', spnSign_oncollapse);	
				}
				
			}
				
			function spnSign_oncollapse(){		

				var spn = event.currentTarget;
				var li = spn.closest('li');
				var ul = li.querySelector("ul");		

				if(ul){
					spn.innerText = '+';
					
					spn.removeEventListener("click", spnSign_oncollapse, false);
					spn.addEventListener('click', spnSign_onexpand);
					
					ul.style.display = 'none';
					
					setIcon('oncollapse');
				}
				else{	
					spn.innerHTML = '&nbsp;';
				}		
			}
						
			function spnSign_onexpand(){		
				var spn = event.currentTarget;
				var li = spn.closest('li');
				var ul = li.querySelector("ul");		

				if(ul){
					spn.innerText = '-';			
					
					spn.removeEventListener("click", spnSign_onexpand, false);
					spn.addEventListener('click', spnSign_oncollapse);
					
					ul.style.display = '';
					
					setIcon('onexpand');
				}
				else{	
					spn.innerHTML = '&nbsp;';
				}		
			}
			
			function spnText_onclick(){			
				var spn  = event.currentTarget;
				spn.classList.add('selected');
				var text = spn.innerText;
				var li   = spn.closest('li');
				options.onclick(text, li);
			}
			
			// Removes the entire 'li' referenced by the selector of any of its sub elements.
			function remove(selector){
				var spnWait = ul.querySelector(selector);
				if(spnWait){
					var li = spnWait.closest('li');						
					li.parentNode.removeChild(li);
				}			
			}	

			remove('span.wait');
			
			var html = '<li><div><span class="sign" ></span><span class="icon">&nbsp;</span><span class="text"></span></div></li>';
			
			ul.insertAdjacentHTML('beforeend', html);
			var li = ul.querySelector('li:last-child'); 		
			
			var hasChild = ((typeof options.onexpand) == (typeof ulToTree));
			
			var spnSign = li.querySelector('span.sign');
			spnSign.innerHTML = hasChild ? '+' : '&nbsp;';			
			
			var onclick = hasChild ? spnSign_onAskData : spnSign_onexpand;
			spnSign.addEventListener('click', onclick);	

			
			var spnIcon = li.querySelector('span.icon');
			spnIcon.setAttribute('title'         , options.title );
			spnIcon.setAttribute('data-iconOpen' , options.icons.open );
			spnIcon.setAttribute('data-iconClose', options.icons.close);
			
			var spntext = li.querySelector('span.text');
			spntext.addEventListener('click', spnText_onclick);	
			spntext.setAttribute('title', text );	
			spntext.innerText = text;			
			
			var ulChild = hasChild ? '<ul></ul>' : '';
			li.insertAdjacentHTML('beforeend', ulChild);
			
			setIcon(false);
			
			return li;
		
		}
		
		return ul;
	}