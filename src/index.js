import { 
	useRef, 
	useEffect, 
	useState, 
	createElement, 
	useId
} from 'react';

/*
 *
 */
  
const SlideInner = (props) => {
	//
	const as = props.as;
	const children = props.children;
	
	//
	delete props.as;
	delete props.children;
	
	//
	return createElement(as ? as : 'div', props, children);
}

const SlideActive = (props) => <SlideInner {...props}/>;

const SlideCollapsed = (props) => <SlideInner {...props}/>;

/*
 *
 */
  
const SlideOuter = function(isActive, index, {children}) {
	
	// 
	const [Active, Collapsed] = children.sort((child, nextChild) => ({
		[child.type === SlideActive || child.type === SlideCollapsed]: -1,
		[nextChild.type === SlideActive]: 1,
	}[true]));
	
	//
	const Slide = isActive ? Active : Collapsed;
	
	//
	Object.assign(Slide.props, {
		tabindex: index,
		'aria-current': isActive,
		'aria-expanded': isActive
	});
	
	//
	return isActive ? Active : Collapsed;
}

/*
 *
 */
  
export const Venetian = ({staticContent, slides, slideElement: Slide}) => {
	
	// Append Static Content
	const staticContentElement = useRef();
	useEffect(() => {
		staticContentElement.current.append(...staticContent.childNodes)
	}, [staticContentElement]);
	
	// Track Active Slide
	const [activeSlide, setActiveSlide] = useState(0);
	
	// Create necessaey Unique ID's for ARIA
	const activeSlideAreaId = useId();
	
	// Parse Children
	const children = slides.map((slide, index) => {
		//
		const key = slide.key ? slide.key : `slide_${index}`;
		delete slide.key; 

		//
		const isActive = activeSlide === index;
		
		//
		return (
			<Slide 
				{...slide} 
				//
				tabindex={index}
				aria-current={isActive}
				aria-expanded={isActive}
				//
				ariaTarget={activeSlideAreaId}
				//
				Content={SlideOuter.bind(undefined, isActive, index)}
				Active={SlideActive}
				Collapsed={SlideCollapsed}
				//
				setActiveSlide={setActiveSlide}
				//
				index={index}
				activeSlide={activeSlide}
			/>
		);
	});
	
	// JSX
	return (
		<>
			<div className='staticContent' ref={staticContentElement}/>
			<div id={activeSlideAreaId} className='activeSlide'>
				{children.splice(activeSlide, 1)}
			</div>
			<div className='collapsedSlides'>
				{children}
			</div>
		</>
  	);
};