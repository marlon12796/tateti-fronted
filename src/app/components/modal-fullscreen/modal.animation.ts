import { style, trigger, transition, animate, query } from '@angular/animations'

const slideInFromRight = trigger('slideInFromRight', [
  transition(':enter', [
    query('.animate', style({ transform: 'translateX(400px)' })),
    query('.animate-2', style({ transform: 'translateX(400px)' })),
    //animate
    query('.animate', [animate('250ms ease-in-out', style({ transform: 'translateX(0)' }))]),
    query('.animate-2', [animate('250ms ease-in-out', style({ transform: 'translateX(0)' }))])
  ]),
  transition(':leave', [
    query('.animate', style({ transform: 'translateX(0px)' })),
    query('.animate-2', style({ transform: 'translateX(0px)' })),
    //animate
    query('.animate', [animate('200ms ease-in', style({ transform: 'translateX(-400px)' }))]),
    query('.animate-2', [animate('200ms ease-in', style({ transform: 'translateX(-400px)' }))])
  ])
])
const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('0.5s ease-in-out', style({ opacity: 1 }))]),
  transition(':leave', [style({ opacity: 1 }), animate('0.5s ease-in', style({ opacity: 0 }))])
])
export const animationsModal = {
  slideInFromRight,
  fadeInOutAnimation
}
