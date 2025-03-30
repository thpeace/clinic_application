import { Link } from 'react-router-dom'
import FooterLogo from '../assets/images/logo-white.svg';
import FacebookLogo from '../assets/images/icon-facebook.svg';
import YoutubeLogo from '../assets/images/icon-youtube.svg';
import TwitterLogo from '../assets/images/icon-twitter.svg';
import PinterestLogo from '../assets/images/icon-pinterest.svg';
import InstagramLogo from '../assets/images/icon-instagram.svg';
import { ImageComponent } from '../components/ImageComponent';
import { AnchorComponent } from '../components/AnchorComponent';

export const FooterComponent = () => {
    return (
        <footer className='bg-veryDarkBlue'>
            <div className='container flex flex-col-reverse justify-between px-6 py-10 mx-auto space-y-8 md:flex-row md:space-y-0'>
                <div className='flex flex-col-reverse items-center justify-between space-y-12 md:flex-col md:space-y-0 md:items-start'>
                    <div className="mx-auto my-6 text-center text-white md:hidden">
                        Copyright &copy; 2022, All Rights Reserved
                    </div>

                    <div>
                        <ImageComponent className="h-8" imageSrc={FooterLogo} altText="Logo in white color" />
                    </div>

                    {/* Social links container */}
                    <div className='flex justify-center space-x-4'>
                        <AnchorComponent link="#">
                            <ImageComponent className="h-8" imageSrc={FacebookLogo} altText="FacebookLogo" />
                        </AnchorComponent>
                        <AnchorComponent link="#">
                            <ImageComponent className="h-8" imageSrc={YoutubeLogo} altText="YoutubeLogo" />
                        </AnchorComponent>
                        <AnchorComponent link="#">
                            <ImageComponent className="h-8" imageSrc={TwitterLogo} altText="TwitterLogo" />
                        </AnchorComponent>
                        <AnchorComponent link="#">
                            <ImageComponent className="h-8" imageSrc={PinterestLogo} altText="PinterestLogo" />
                        </AnchorComponent>
                        <AnchorComponent link="#">
                            <ImageComponent className="h-8" imageSrc={InstagramLogo} altText="InstagramLogo" />
                        </AnchorComponent>
                    </div>
                </div>

                {/* List container */}
                <div className="flex justify-around space-x-32">
                    <div className="flex flex-col space-y-3 text-white">
                        <AnchorComponent link="#" className='hover:text-brightRed' title="Go to home page">
                            <Link to='/'>Home</Link>
                        </AnchorComponent>
                        <AnchorComponent link="#" className='hover:text-brightRed' title="Go to pricing page">
                            <Link to='/pricing'>Pricing</Link>
                        </AnchorComponent>
                        <AnchorComponent link="#" className='hover:text-brightRed' title="Go to product page">
                            <Link to='/product'>Product</Link>
                        </AnchorComponent>
                    </div>
                    <div className="flex flex-col space-y-3 text-white">
                        <AnchorComponent link="#" className='hover:text-brightRed' title="Go to about page">
                            <Link to='/about'>About Us</Link>
                        </AnchorComponent>
                        <AnchorComponent link="#" className='hover:text-brightRed' title="Go to careers page">
                            <Link to='/careers'>Careers</Link>
                        </AnchorComponent>
                        <AnchorComponent link="#" className='hover:text-brightRed' title="Go to community page">
                            <Link to='/community'>Community</Link>
                        </AnchorComponent>
                    </div>
                </div>

                {/* Input container */}
                <div className="flex flex-col justify-between">
                    <form action="">
                        <div className="flex space-x-3">
                            <input type="text" className="flex-1 px-4 rounded-full focus:outline-none"
                                placeholder="Updated in your inbox" />
                            <button className="px-6 py-2 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none">
                                Go
                            </button>
                        </div>
                    </form>

                    <div className="hidden text-white md:block">
                        Copyright &copy; 2022, All Rights Reserved
                    </div>
                </div>
            </div>
        </footer>
    )
}
