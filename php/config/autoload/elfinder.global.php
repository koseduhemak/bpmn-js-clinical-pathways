<?php
/**
 * Created by PhpStorm.
 * User: mfuesslin
 * Date: 16.02.2017
 * Time: 11:33
 */

return array(
    'router' => array(
        'routes' => array(
            'elFinder' => array(
                'type' => 'Zend\Router\Http\Segment',
                'options' => array(
                    'route' => '/elfinder[/:fileType]',
                    'defaults' => array(
                        'controller'
                        => 'ElFinderIndexController',
                        'action' => 'index',
                    ),
                ),
            ),
            'elFinderConnector' => array(
                'type' => 'Zend\Router\Http\Segment',
                'options' => array(
                    'route' => '/elfinder/connector[/:fileType]',
                    'defaults' => array(
                        'controller'
                        => 'ElFinderIndexController',
                        'action' => 'connector',
                    )
                ),
            ),
            'elFinderStandAlone' => array(
                'type' => 'Zend\Router\Http\Segment',
                'options' => array(
                    'route' => '/elfinder/standalone[/:fileType]',
                    'defaults' => array(
                        'controller'
                        => 'ElFinderIndexController',
                        'action' => 'standAlone',
                    ),
                ),
            ),
            'elFinderCkEditor' => array(
                'type' => 'Zend\Router\Http\Segment',
                'options' => array(
                    'route' => '/elfinder/ckeditor[/:fileType]',
                    'defaults' => array(
                        'controller'
                        => 'ElFinderIndexController',
                        'action' => 'ckEditorFileManager',
                    )
                ),
            ),
            'elFinderTinyMce' => array(
                'type' => 'Zend\Router\Http\Segment',
                'options' => array(
                    'route' => '/elfinder/tinymce[/:fileType]',
                    'defaults' => array(
                        'controller'
                        => 'ElFinderIndexController',
                        'action' => 'tinymceFileManager',
                    )
                ),
            ),
        ),
    ),

    'elfinder' => array(
        'useGoogleJquery' => true,
        'disableLayouts' => true,
        'connectorPath' => '/elfinder/connector',
        'mounts' => array(
            'folders' => array(
                'roots' => array(
                    'workspace' => array(
                        // driver for accessing file system (REQUIRED)
                        'driver' => 'LocalFileSystem',

                        // path to files (REQUIRED)
                        'path' => 'public/workspace/',

                        // URL to files (REQUIRED)
                        'URL' => '/workspace/',

                        // disable and hide dot starting files (OPTIONAL)
                        'accessControl' => function($attr, $path, $data, $volume) {
                            if ($attr === 'hidden') {
                                if (! is_dir($path)) {
                                    return true;
                                }
                            }
                            return null;
                        }
                    ),
                ),
            ),
            'defaults' => array(
                'roots' => array(
                    'defaults' => array(
                        'driver' => 'LocalFileSystem',
                        // driver for accessing file system (REQUIRED)
                        'path' => 'public/workspace/',
                        // URL to files (REQUIRED)
                        'URL' => '/workspace/',
                        'accessControl' => 'access',
                        // disable and hide dot starting files (OPTIONAL)
                        'attributes' => array(
                            array( // hide readmes
                                //'pattern' => '/images/',
                                'read' => true,
                                'write' => true,
                                'hidden' => false,
                                'locked' => false
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);

