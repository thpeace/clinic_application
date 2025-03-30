import AvatarAnisha from '../assets/images/avatar-anisha.png';
import AvatarAli from '../assets/images/avatar-ali.png';
import AvatarRichard from '../assets/images/avatar-richard.png';
import { TestimonialsComponent } from './TestimonialsComponent';
import { AnchorComponent } from '../components/AnchorComponent';

export const TestimonialsSection = () => {
    return (
        <section id="testimonials">
            <div className="max-w-6xl px-5 mx-auto mt-32 text-center">
                <h2 className="text-4xl font-bold text-center">
                    What&#39;s different about Manage?
                </h2>

                <div className="flex flex-col space-y-12 mt-24 md:flex-row md:space-x-6 md:space-y-0">
                    < TestimonialsComponent className="flex" imageSrc={AvatarAnisha} altText="Anisha's image" name="Anisha Li" text="“Manage has supercharged our team’s workflow. The ability to maintain visibility on larger milestones at all times keeps everyone motivated.”" />
                    < TestimonialsComponent className="flex" imageSrc={AvatarAli} altText="Ali's image" name="Ali Bravo" text="“We have been able to cancel so many other subscriptions since using Manage. There is no more cross-channel confusion and everyone is much more focused.”" />
                    < TestimonialsComponent className="flex" imageSrc={AvatarRichard} altText="Richard's image" name="Richard Watts" text="“Manage has supercharged our team’s workflow. The ability to maintain visibility on larger milestones at all times keeps everyone motivated.”" />
                </div>

                <div className="my-16">
                    <AnchorComponent link="#" className="p-3 px-6 pt-2 rounded-full baseline text-white bg-brightRed hover:bg-brightRedLight">
                        Get started
                    </AnchorComponent>
                </div>
            </div>
        </section>
    )
}
