<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;

return [
    'router' => [
        'routes' => [
            'home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'application' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/application[/:action]',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'home-dmn' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/dmn/index.html',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'indexDMN',
                    ],
                ],
            ],
            'elFinderFolder' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/elfinder/folder',
                    'defaults' => [
                        'controller' => 'ElFinderIndexController',
                        'action'     => 'folder',
                    ],
                ],
            ],
            'getDiagram' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/diagram/get/:diagram',
                    'defaults' => [
                        'controller' => Controller\DiagramController::class,
                        'action'     => 'get',
                    ],
                    'constraints' => [
                        'diagram' => '.+'
                    ]
                ],
            ],
            'saveDiagram' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/diagram/save/:diagram',
                    'defaults' => [
                        'controller' => Controller\DiagramController::class,
                        'action'     => 'save',
                    ],
                    'constraints' => [
                        'diagram' => '.+'
                    ]
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            Controller\IndexController::class => InvokableFactory::class,
            'ElFinderIndexController' => Factory\Controller\IndexControllerFactory::class,
            Controller\DiagramController::class => InvokableFactory::class
        ],
        'invokables' => [

        ]
    ],

    'service_manager' => array(
        'factories' => array(
            'ElFinderManager' => Factory\Service\ElFinderManagerFactory::class
        ),
    ),

    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ],
];
